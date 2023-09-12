import { BaseSyntheticEvent, Fragment } from "react";
import { CollectionType } from "../Collections";

interface CollectionMenuProps {
  collectionType: CollectionType;
  onCollectionClicked: (e: BaseSyntheticEvent) => void;
}

function CollectionMenu({
  collectionType,
  onCollectionClicked,
}: CollectionMenuProps) {
  return (
    <Fragment>
      <input
        type="radio"
        name="collection"
        className="form-check-input"
        value={CollectionType.Wild}
        id="wild"
        checked={collectionType === CollectionType.Wild}
        onChange={onCollectionClicked}
      />
      <label className="form-check-label" htmlFor="wild">
        Wild
      </label>
      <input
        type="radio"
        name="collection"
        className="form-check-input"
        style={{ marginLeft: "5px" }}
        value={CollectionType.Boxes}
        id="boxes"
        checked={collectionType === CollectionType.Boxes}
        onChange={onCollectionClicked}
      />
      <label className="form-check-label" htmlFor="boxes">
        Boxes
      </label>
    </Fragment>
  );
}

export default CollectionMenu;
