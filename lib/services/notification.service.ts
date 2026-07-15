export const notificationService = {
  getNotifications: async () => {
    return new Promise((resolve) => setTimeout(() => resolve([
      { id: "1", title: "New Message", message: "You have a new message from a candidate", read: false },
      { id: "2", title: "System Update", message: "Scheduled maintenance in 2 hours", read: true }
    ]), 600));
  }
};
