import HttpService from "./https";
class BaseApi extends HttpService {
  constructor() {
    super();
    super.init();
  }
}
export default BaseApi;
