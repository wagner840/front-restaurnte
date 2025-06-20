// Importa o som de notificação (você precisa adicionar este arquivo na pasta public)
let notificationSound: HTMLAudioElement | null = null;

export function initializeSounds() {
  notificationSound = new Audio("/sounds/notification.mp3");
  notificationSound.load();
}

export function playNotificationSound() {
  if (notificationSound) {
    notificationSound.play().catch(() => {});
  }
}

// Inicializa os sons quando o módulo é carregado
initializeSounds();
