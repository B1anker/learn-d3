import { MySelection } from '@/define/type';
/*
 * 根元素
 */
export default class Root {
  protected selection: MySelection = null;

  public getSelection () {
    return this.selection;
  }
}
