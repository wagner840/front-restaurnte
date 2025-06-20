// Sistema de notificação por som melhorado
let notificationSound: HTMLAudioElement | null = null;
let audioInitialized = false;
let userInteracted = false;

// Função para inicializar o áudio de forma segura
export function initializeSounds() {
  try {
    if (!notificationSound) {
      notificationSound = new Audio();
      notificationSound.src = "/sounds/notification.mp3";
      notificationSound.preload = "auto";
      
      // Configurar volume
      notificationSound.volume = 0.7;
      
      // Adicionar listeners para debug
      notificationSound.addEventListener('canplaythrough', () => {
        console.log('Som carregado com sucesso');
        audioInitialized = true;
      });
      
      notificationSound.addEventListener('error', (e) => {
        console.error('Erro ao carregar som:', e);
        audioInitialized = false;
      });
      
      // Tentar carregar o áudio
      notificationSound.load();
    }
  } catch (error) {
    console.error('Erro ao inicializar sons:', error);
  }
}

// Função para marcar que o usuário interagiu (importante para autoplay)
export function markUserInteraction() {
  userInteracted = true;
  
  // Tentar inicializar o áudio após interação do usuário
  if (!audioInitialized) {
    initializeSounds();
  }
}

// Função melhorada para reproduzir notificação
export async function playNotificationSound(): Promise<boolean> {
  try {
    // Verificar se o áudio foi inicializado
    if (!notificationSound) {
      console.warn('Som não inicializado');
      initializeSounds();
      return false;
    }

    // Verificar se o usuário já interagiu (necessário para autoplay)
    if (!userInteracted) {
      console.warn('Usuário ainda não interagiu - som pode ser bloqueado pelo navegador');
    }

    // Resetar o áudio para o início se já estiver tocando
    notificationSound.currentTime = 0;
    
    // Tentar reproduzir o som
    const playPromise = notificationSound.play();
    
    if (playPromise !== undefined) {
      await playPromise;
      console.log('Som reproduzido com sucesso');
      return true;
    }
    
    return false;
    
  } catch (error) {
    console.error('Erro ao reproduzir som:', error);
    
    // Se for um erro de autoplay, registrar para o usuário
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      console.warn('Reprodução bloqueada pelo navegador - interação do usuário necessária');
    }
    
    return false;
  }
}

// Função para testar o som manualmente
export async function testNotificationSound(): Promise<boolean> {
  markUserInteraction(); // Marcar interação do usuário
  return await playNotificationSound();
}

// Inicializar quando o módulo é carregado
initializeSounds();

// Adicionar listener para primeira interação do usuário
if (typeof document !== 'undefined') {
  const handleFirstInteraction = () => {
    markUserInteraction();
    document.removeEventListener('click', handleFirstInteraction);
    document.removeEventListener('keydown', handleFirstInteraction);
    document.removeEventListener('touchstart', handleFirstInteraction);
  };
  
  document.addEventListener('click', handleFirstInteraction);
  document.addEventListener('keydown', handleFirstInteraction);
  document.addEventListener('touchstart', handleFirstInteraction);
}
