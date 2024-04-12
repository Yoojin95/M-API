import React from "react";
import { Row, Col, Card, Container } from "react-bootstrap";
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import ArtworkCard from "@/components/ArtworkCard";

const Favourites = () => {
  const [favouritesList] = useAtom(favouritesAtom);
  if (favouritesList === null) {
    return <Container className="mt-5">Loading...</Container>;
  }

  return (
    <Container className="mt-5">
      {favouritesList && favouritesList.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {favouritesList.map((objectID) => (
            <Col key={objectID}>
              <ArtworkCard objectID={objectID} />
            </Col>
          ))}
        </Row>
      ) : (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            Try adding some new artwork to the list.
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Favourites;
