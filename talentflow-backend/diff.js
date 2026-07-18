const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, 'prisma', 'migrations');
const temp2Path = path.join(__dirname, 'temp2.sql');

function getColumnsFromSQL(sql) {
    const tables = {};
    const tableRegex = /CREATE TABLE "([^"]+)" \(([\s\S]*?)\);/g;
    let match;
    while ((match = tableRegex.exec(sql)) !== null) {
        const tableName = match[1];
        const body = match[2];
        const columns = new Set();
        const lines = body.split('\n');
        for (const line of lines) {
            const colMatch = line.trim().match(/^"([^"]+)"/);
            if (colMatch) {
                columns.add(colMatch[1]);
            }
        }
        tables[tableName] = columns;
    }

    const alterRegex = /ALTER TABLE "([^"]+)" ADD COLUMN\s+"([^"]+)"/g;
    while ((match = alterRegex.exec(sql)) !== null) {
        const tableName = match[1];
        const colName = match[2];
        if (!tables[tableName]) tables[tableName] = new Set();
        tables[tableName].add(colName);
    }
    return tables;
}

const allMigrationsSQL = fs.readdirSync(migrationsDir)
    .filter(dir => fs.statSync(path.join(migrationsDir, dir)).isDirectory())
    .map(dir => {
        const p = path.join(migrationsDir, dir, 'migration.sql');
        return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
    })
    .join('\n\n');

const migrationTables = getColumnsFromSQL(allMigrationsSQL);
const currentTables = getColumnsFromSQL(fs.readFileSync(temp2Path, 'utf8'));

const differences = {};

for (const tableName of Object.keys(currentTables)) {
    if (!migrationTables[tableName]) {
        differences[tableName] = { type: 'NEW_TABLE', columns: Array.from(currentTables[tableName]) };
    } else {
        const currCols = currentTables[tableName];
        const migCols = migrationTables[tableName];
        const missing = Array.from(currCols).filter(c => !migCols.has(c));
        if (missing.length > 0) {
            differences[tableName] = { type: 'ALTER_TABLE', missingColumns: missing };
        }
    }
}

console.log(JSON.stringify(differences, null, 2));
