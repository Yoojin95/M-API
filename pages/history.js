import React from "react";
import { Card, Button, ListGroup } from "react-bootstrap";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import { removeFromHistory } from "@/lib/userData";
import styles from "@/styles/History.module.css";

const History = () => {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();

  if (!searchHistory) return null;

  let parsedHistory = searchHistory.map((h) => {
    let params = new URLSearchParams(h);
    return Object.fromEntries(params.entries());
  });

  const historyClicked = (e, index) => {
    e.preventDefault();
    router.push(`/artwork?${searchHistory[index]}`);
  };

  const removeHistoryClicked = async (e, index) => {
    e.stopPropagation();
    try {
      const updatedHistory = await removeFromHistory(searchHistory[index]);
      setSearchHistory(updatedHistory);
    } catch (error) {
      console.error("Error removing history item:", error);
    }
  };
  return (
    <Card className="m-4">
      <Card.Body>
        {parsedHistory.length === 0 ? (
          <Card.Body>
            <h4>Nothing Here</h4>
            Try searching for some artwork.
          </Card.Body>
        ) : (
          <ListGroup>
            {parsedHistory.map((historyItem, index) => (
              <ListGroup.Item key={index} className={styles.historyListItem} onClick={(e) => historyClicked(e, index)}>
                {Object.keys(historyItem).map((key) => (
                  <React.Fragment key={key}>
                    {key}: <strong>{historyItem[key]}</strong>&nbsp;
                  </React.Fragment>
                ))}
                <Button className="float-end" variant="danger" size="sm" onClick={(e) => removeHistoryClicked(e, index)}>
                  &times;
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default History;
