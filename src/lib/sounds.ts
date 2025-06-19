// Importa o som de notificação (você precisa adicionar este arquivo na pasta public)
let notificationSound: HTMLAudioElement | undefined;

export function initializeSounds() {
  if (!notificationSound) {
    notificationSound = new Audio("/sounds/notification.mp3");
  }
}

export function playNotificationSound() {
  if (notificationSound) {
    notificationSound.play();
  }
}
