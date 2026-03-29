import { Player } from "textalive-app-api";

export const createTextAlivePlayer = (token: string, mediaElement?: HTMLElement): Player => {
  return new Player({
    app: { token },
    mediaElement,
  });
};