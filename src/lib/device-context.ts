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

type GeoOptions = {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
};

function getCurrentPositionWith(options: GeoOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Seu dispositivo não suporta geolocalização"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

export async function getCurrentPosition(): Promise<GeolocationPosition> {
  try {
    return await getCurrentPositionWith({
      enableHighAccuracy: false,
      timeout: 5_000,
      maximumAge: 120_000,
    });
  } catch {
    return getCurrentPositionWith({
      enableHighAccuracy: true,
      timeout: 8_000,
      maximumAge: 60_000,
    });
  }
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

export async function tryCollectRegistrationContext(): Promise<RegistrationContext | null> {
  try {
    return await collectRegistrationContext();
  } catch {
    return null;
  }
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
