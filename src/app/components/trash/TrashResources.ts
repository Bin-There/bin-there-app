import {Trash} from "./trash";

export class TrashResources {

  public getImageForType(trash: Trash): string {

    switch (trash.type) {
      case 'plastic' :
        return 'assets/trashpoint_plastic.svg';
      case 'glass' :
        return 'assets/trashpoint_glass.svg';
      case 'paper' :
        return 'assets/trashpoint_paper.svg';
      case 'metal' :
        return 'assets/trashpoint_metal.svg';
      case 'compostable' :
        return 'assets/trashpoint_bio.svg';
      case 'debris':
        return 'assets/trashpoint_debris.svg';
      case 'electronic_waste':
        return 'assets/trashpoint_electronic_waste.svg';
      case 'oil':
        return 'assets/trashpoint_oil.svg';
    }

    return 'assets/trashpoint_mix.svg';
  }

  public getImageForEntityType(trash: Trash): string {

    switch (trash.entityType) {
      case 'bin' :
        return 'assets/entity_bin.svg';
      case 'mixed' :
        return 'assets/entity_mixed.svg';
      case 'collectible' :
        return 'assets/entity_collectible.svg';
    }

    return 'assets/entity_mixed.svg';
  }

  public getImageForEntityStatus(trash: Trash): string {

    switch (trash.status) {
      case 'ready' :
        return 'assets/status_empty.svg';
      case 'full' :
        return 'assets/status_full.svg';
      case 'overfilled' :
        return 'assets/status_overloaded.svg';
    }

    return 'assets/not_applicable.svg';
  }
  public getDateTimeString(value: any) : string{

    if(value)
    {
      let date: Date = value.toDate();

      return date.toLocaleString();
    }

    return value;
  }
}

