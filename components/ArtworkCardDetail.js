import { Card, Button } from "react-bootstrap";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { addToFavourites, removeFromFavourites } from "@/lib/userData";
import Error from "next/error";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ArtworkCardDetail = ({ objectID }) => {
  const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null, fetcher);

  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    setShowAdded(favouritesList?.includes(objectID));
  }, [favouritesList, objectID]);

  const favouritesClicked = async () => {
    if (showAdded) {
      await removeFromFavourites(objectID);
      setFavouritesList(favouritesList.filter((fav) => fav !== objectID));
    } else {
      await addToFavourites(objectID);
      setFavouritesList([...favouritesList, objectID]);
    }
  };

  if (error) return <Error statusCode={404} />;
  if (!data) return null;
  const { primaryImage, title, objectDate, classification, medium, artistDisplayName, creditLine, dimensions, artistWikidata_URL } = data;

  return (
    <Card>
      {primaryImage && <Card.Img variant="top" src={primaryImage} />}
      <Card.Body>
        <Card.Title>{title || "N/A"}</Card.Title>
        <Card.Text>
          <strong>Date:</strong> {objectDate || "N/A"}
          <br />
          <strong>Classification:</strong> {classification || "N/A"}
          <br />
          <strong>Medium:</strong> {medium || "N/A"}
          <br />
          <br />
          <strong>Artist:</strong> {artistDisplayName || "N/A"}{" "}
          {artistDisplayName && (
            <a href={artistWikidata_URL} target="_blank" rel="noreferrer">
              wiki
            </a>
          )}
          <br />
          <strong>Credit Line:</strong> {creditLine || "N/A"}
          <br />
          <strong>Dimensions:</strong> {dimensions || "N/A"}
          <br />
          <br />
          <Button variant={showAdded ? "secondary" : "outline-secondary"} onClick={favouritesClicked}>
            {showAdded ? "+ Favourite (added)" : "+ Favourite"}
          </Button>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ArtworkCardDetail;
