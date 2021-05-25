import {KeyValuePairModel} from './key-value-pair.model';

export interface Co2Model {
  origin: string;
  destination: string;
  firstDictionary: KeyValuePairModel[];
  secondDictionary: KeyValuePairModel[];
}
