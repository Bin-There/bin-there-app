import {Trash} from "./trash";

export class TrashResources {

  public getImageForType(trash: Trash): string {

    switch (trash.type) {
      case 'plastic' :
        return 'assets/bin_plastic_01.svg';
      case 'glass' :
        return 'assets/bin_glass_01.svg';
      case 'paper' :
        return 'assets/bin_paper_01.svg';
      case 'metal' :
        return 'assets/bin_metal_lnl_01.svg';
      case 'compostable' :
        return 'assets/bin_bio_01.svg';
    }

    return 'assets/bin_mix_01.svg';
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

    return 'assets/status_half.svg';
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

