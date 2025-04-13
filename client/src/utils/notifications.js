export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const createNotification = (title, options) => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.log('Notification permission not granted');
    return null;
  }

  const notification = new Notification(title, options);

  return notification;
};