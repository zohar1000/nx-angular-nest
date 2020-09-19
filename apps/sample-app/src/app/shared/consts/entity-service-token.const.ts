import { InjectionToken } from '@angular/core';
import { BaseEntityService } from '../base-classes/base-entity.service';

export const EntityServiceToken = new InjectionToken<BaseEntityService>('EntityServiceToken');
