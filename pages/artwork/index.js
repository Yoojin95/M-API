import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Row, Col, Pagination, Card } from "react-bootstrap";
import ArtworkCard from "@/components/ArtworkCard";
import Error from "next/error";
import validObjectIDList from "@/public/data/validObjectIDList.json";

const PER_PAGE = 12;

const Artwork = () => {
  const [artworkList, setArtworkList] = useState(null);
  const [page, setPage] = useState(1);
  const router = useRouter();
  let finalQuery = router.asPath.split("?")[1];

  // useSWR hook automatically provides a loading state.
  const { data, error, isValidating } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`);

  useEffect(() => {
    if (data && Array.isArray(data.objectIDs)) {
      let filteredResults = validObjectIDList.objectIDs.filter((x) => data.objectIDs.includes(x));

      let results = [];
      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }
      setArtworkList(results);
    } else {
      setArtworkList([]);
    }
    setPage(1);
  }, [data]);

  const previousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const nextPage = () => {
    if (page < artworkList?.length) setPage(page + 1);
  };

  if (error) return <Error statusCode={404} />;
  if (!artworkList && !isValidating)
    return (
      <Card>
        <Card.Body>
          <h4>Nothing Here</h4>Try searching for something else.
        </Card.Body>
      </Card>
    );
  if (isValidating)
    return (
      <Card>
        <Card.Body>
          <h4>Loading...</h4>
        </Card.Body>
      </Card>
    ); // Display loading message

  return (
    <>
      <Row className="gy-4">
        {artworkList.length > 0 ? (
          artworkList[page - 1].map((objectID) => (
            <Col lg={3} key={objectID}>
              <ArtworkCard objectID={objectID} />
            </Col>
          ))
        ) : (
          <Card>
            <Card.Body>
              <h4>Nothing Here</h4>
              Try searching for something else.
            </Card.Body>
          </Card>
        )}
      </Row>
      {artworkList.length > 0 && (
        <Row>
          <Col>
            <Pagination className="custom-pagination">
              <Pagination.Prev onClick={previousPage} />
              <Pagination.Item active>{page}</Pagination.Item>
              <Pagination.Next onClick={nextPage} />
            </Pagination>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Artwork;
