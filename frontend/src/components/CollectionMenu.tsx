import { BaseSyntheticEvent, Fragment } from "react";
import { CollectionType } from "../models/Collections";

interface CollectionMenuProps {
  collectionType: CollectionType.Wild | CollectionType.Pokedex;
  onCollectionClicked: (e: BaseSyntheticEvent) => void;
}

function CollectionMenu({
  collectionType,
  onCollectionClicked,
}: CollectionMenuProps) {
  return (
    <Fragment>
      <div style={{ marginLeft: "1vw" }}>
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
          value={CollectionType.Pokedex}
          id="pokedex"
          checked={collectionType === CollectionType.Pokedex}
          onChange={onCollectionClicked}
        />
        <label className="form-check-label" htmlFor="pokedex">
          Pokedex
        </label>
      </div>
    </Fragment>
  );
}

export default CollectionMenu;
