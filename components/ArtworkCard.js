import { Card, Button } from "react-bootstrap";
import useSWR from "swr";
import Link from "next/link";
import Error from "next/error";

const fetcher = (url) => fetch(url).then((res) => res.json());
const ArtworkCard = ({ objectID }) => {
  const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null, fetcher);

  if (error || !data || Object.keys(data).length === 0 || data.message === "ObjectID not found") {
    return <Error statusCode={404} />;
  }

  const {
    primaryImageSmall = "https://via.placeholder.com/375x375.png?text=Not+Available",
    title = "N/A",
    objectDate = "N/A",
    classification = "N/A",
    medium = "N/A",
  } = data;

  if (primaryImageSmall.includes("placeholder.com")) {
    return <Error statusCode={404} />;
  }

  return (
    <Card>
      <Card.Img variant="top" src={primaryImageSmall || "https://via.placeholder.com/375x375.png?text=Not+Available"} />
      <Card.Body>
        <Card.Title>{title || "N/A"}</Card.Title>
        <Card.Text>
          <strong>Date:</strong> {objectDate || "N/A"}
          <br />
          <strong>Classification:</strong> {classification || "N/A"}
          <br />
          <strong>Medium:</strong> {medium || "N/A"}
        </Card.Text>
        <Link href={`/artwork/${objectID}`} passHref>
          <Button variant="dark">ID {objectID}</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default ArtworkCard;
