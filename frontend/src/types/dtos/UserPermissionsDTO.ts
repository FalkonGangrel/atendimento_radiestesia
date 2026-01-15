import type { CustomField } from '@/types/entities/CustomField';
import type { ListModel } from '@/types/entities/ListModel';

export interface UserPermissionsDTO {
  has_permission: boolean;
  available_fields: CustomField[];
  selected_field_ids: number[];
  available_list_models: ListModel[];
  selected_list_model_ids: number[];
  selected_list_item_ids: number[];
}
