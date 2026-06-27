export interface DeviceMeta {
  userAgent: string;
  platform: string;
  language: string;
  connectionType?: string;
  effectiveType?: string;
  downlink?: number;
}

export interface RegistrationContext extends DeviceMeta {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface SubmitContext {
  latitude: number;
  longitude: number;
  accuracy?: number;
  deviceMeta: DeviceMeta;
}

type NavigatorConnection = Navigator & {
  connection?: {
    type?: string;
    effectiveType?: string;
    downlink?: number;
  };
};

export function collectDeviceMeta(): DeviceMeta {
  const nav = navigator as NavigatorConnection;

  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    connectionType: nav.connection?.type,
    effectiveType: nav.connection?.effectiveType,
    downlink: nav.connection?.downlink,
  };
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Seu dispositivo não suporta geolocalização"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 20_000,
      maximumAge: 0,
    });
  });
}

export async function collectRegistrationContext(): Promise<RegistrationContext> {
  const position = await getCurrentPosition();
  const deviceMeta = collectDeviceMeta();

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    ...deviceMeta,
  };
}

export async function collectSubmitContext(): Promise<SubmitContext> {
  const position = await getCurrentPosition();

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    deviceMeta: collectDeviceMeta(),
  };
}

export function getGeoErrorMessage(error: unknown): string {
  if (error instanceof GeolocationPositionError) {
    if (error.code === error.PERMISSION_DENIED) {
      return "Permita o acesso à localização para continuar";
    }
    if (error.code === error.POSITION_UNAVAILABLE) {
      return "Não foi possível obter sua localização";
    }
    if (error.code === error.TIMEOUT) {
      return "A localização demorou demais. Tente novamente";
    }
  }

  if (error instanceof Error) return error.message;
  return "Erro ao obter localização";
}
