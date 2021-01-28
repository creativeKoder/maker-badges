import * as _ from 'lodash';
import { addOrUpdateTemplateRecord } from "../utils/aws";
import { ZERO_ROOT } from '../constants';
import MerkleTree from "../utils/merkleTree";

const updateTemplateRecord = ((record, templateId) => {
  return new Promise(async (resolve) => {
    const addresses = _.get(record, 'addresses');
    const progress  = _.get(record, 'progress');

    if (_.size(addresses)) {
      const tree = new MerkleTree(addresses);

      if (process.env.ENVIRONMENT === "local") {
        await addOrUpdateTemplateRecord(
          templateId,
          addresses || [],
          tree.getHexRoot() || ZERO_ROOT,
          progress || {},
        );
      }

      console.log(templateId, tree.getHexRoot() || ZERO_ROOT,);
      resolve(true);
      return;
    }

    console.log('No Addresses for template #' + templateId);

    if (process.env.ENVIRONMENT === "local")
      await addOrUpdateTemplateRecord(templateId, [], ZERO_ROOT, {});

    resolve(true);
    return;
  });
});

export default updateTemplateRecord;
