import { Player } from "textalive-app-api";

export const createTextAlivePlayer = (token: string): Player => {
  return new Player({
    app: { token },
    mediaElement: undefined,
  });
};