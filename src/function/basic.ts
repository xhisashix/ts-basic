export const logMessage = (message: string): void => {
  console.log('function basic sample1', message);
}

export function logMessage2(message: string): void {
  console.log('function basic sample2', message);
}

export const logMessage3 = function ( message: string): void {
  console.log('function basic sample3', message);
}

export const logMessage4 = (message: string): void => console.log('function basic sample4', message);

export const alwaysThrowError = (): never => {
  throw new Error('always throw error');
}

// 呼び出しシグネチャ
type LogMessage = (message: string) => void;
export const logMessage5: LogMessage = (message: string): void => {
  console.log('function basic sample5', message);
}

// 完全な呼び出し
type fullLogMessage = {
  (message: string): void;
}
export const logMessage7: fullLogMessage = (message: string): void => {
  console.log('function basic sample7', message);
}