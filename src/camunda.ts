import { CamundaAuthToken } from '6_shared/api/camunda/types';

class Camunda {
  private _token?: CamundaAuthToken = undefined;

  setToken(token: CamundaAuthToken) {
    this._token = token;
  }

  getToken(): CamundaAuthToken | undefined {
    return this._token;
  }
}

const camunda = new Camunda();

export default camunda;
