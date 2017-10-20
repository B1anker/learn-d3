import { MySelection } from '../define/type';

export default class Root {
  protected selection: MySelection = null;

  public getSelection () {
    return this.selection;
  }
}
