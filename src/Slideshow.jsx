import styled from "styled-components";
import React, { useState, useCallback } from "react";
import * as R from "ramda";
import useInterval from "use-interval";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
/*
1.)
- Make an object of objects keyed by ID
- Inner object contains a name, List of Widgets
2.)
-In the Left bar, get the keys of that object of Objects 
and output an unorderd list of buttons, onc efor each ID
-have the value of the name be the name from the inner object
-Create/reuse a useState that is currentDB
Have the onClick to set the current dashboard ID to the clicke ID
3.)
-In the iD area, show the name of the of the current dashboard
-Show a toggle button that says Add / Remove from SS
-Have the OnClick callback append the current DB ID to the current Id in the slideShow 
when the dashboard is not in that list
-Have the onClick call back remove the current db from the slideshow if the DB is in the List
-
*/

const alphaSort = (a, b) => a.localeCompare(b);
const makeGetNextId = (newList) =>
  R.pipe(
    R.equals,
    R.findIndex(R.__, newList),
    R.inc,
    R.nth(R.__, newList),
    R.defaultTo(R.head(newList))
  );
const defaultState = ["ABC123", "DEF234", "HIJ345"];
const dashBoards = {
  ABC123: {
    id: "ABC123",
    name: "DB1",
    widgets: ["widget A", "widget B", "widget H", "widget E"]
  },
  DEF234: { id: "DEF234", name: "DB2", widgets: ["widget C", "widget D"] },
  HIJ345: {
    id: "HIJ345",
    name: "DB3",
    widgets: ["widget H", "widget I", "widget 5"]
  },
  KLM456: { id: "KLM456", name: "DB4", widgets: ["widget K", "widget L"] },
  QRS567: { id: "QRS567", name: "DB5", widgets: ["widget Q", "widget R"] }
};

export const Slideshow = () => {
  const [ids, setIds] = useState(defaultState);
  const [newItem, setNewItem] = useState();
  const [currentDashBoard, setCurrentDashBoard] = useState(ids[0]);
  const [delay, setDelay] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const widgets = R.path([currentDashBoard, "widgets"], dashBoards);
  const name = R.path([currentDashBoard, "name"], dashBoards);
  const existsInSlideshow = R.includes(currentDashBoard, ids);

  //Getting next ID and Cyling
  const getNextId = makeGetNextId(ids);
  useInterval(
    () => {
      // Your custom logic here
      setCurrentDashBoard(getNextId(currentDashBoard));
    },
    isRunning ? delay : null
  ); // passing null instead of 1000 will cancel the interval if it is already running

  //Add Function usign callback
  const addItem = useCallback(() => {
    // uniq avoids duplicates
    setIds(R.pipe(R.append(newItem), R.uniq));
    setNewItem("");
  }, [newItem, setIds]);

  const delItem = useCallback((idToDelete) => setIds(R.without(idToDelete)), [
    setIds
  ]);

  const Alphabetize = useCallback(() => setIds(R.sort(alphaSort)), [setIds]);

  const sortIds = (result) => {
    if (!result.destination) return;
    const newIDS = Array.from(ids);
    const [reorderedIDS] = newIDS.splice(result.source.index, 1);
    newIDS.splice(result.destination.index, 0, reorderedIDS);
    setIds(newIDS);
  };

  const showSSBar = () => setIsShowing(true);

  const hideSSBar = () => setIsShowing(false);

  const dbElements = R.pipe(
    R.keys,
    R.map((id) => {
      const name = R.path([id, "name"], dashBoards);
      return (
        <li key={id}>
          <button
            onClick={() => setCurrentDashBoard(id)}
            disabled={R.equals(currentDashBoard, id)}
          >
            {name}
          </button>
        </li>
      );
    })
  )(dashBoards);

  const addDB = useCallback(() =>
    setIds(R.pipe(R.append(currentDashBoard), R.uniq))
  );

  const removeDB = useCallback(() => setIds(R.without(currentDashBoard)));

  const IDList = (
    <DragDropContext onDragEnd={sortIds}>
      <Droppable droppableId="items">
        {(provided) => (
          <ul {...provided.droppableProps} ref={provided.innerRef}>
            {ids.map((id, index) => (
              <Draggable key={id} draggableId={id} index={index}>
                {(provided) => (
                  <li
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                  >
                    {R.path([id, "name"], dashBoards)}

                    <button onClick={() => delItem(id)}>(x)</button>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );

  //Return AKA What you're going to see
  return (
    <Style>
      <div className="wrapper">
        <div className="box action">
          ID:
          <input
            type="text"
            name="newItem"
            id="newItem"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          {/* Add button */}
          <button type="submit" onClick={addItem}>
            Add
          </button>
          {/* Alpha button */}
          <button type="button" onClick={Alphabetize}>
            Alphabetize
          </button>
          {/* S/P button */}
          <button type="button" onClick={() => setIsRunning(R.not)}>
            {isRunning ? "Pause" : "Start"}
          </button>
          {/* SS button */}
          <button type="button" onClick={showSSBar}>
            Slideshow
          </button>
        </div>
        {/* Name Area */}
        <div className=" box DBTitle">
          {" "}
          Name: {name}
          <div>
            {existsInSlideshow ? (
              <button onClick={() => removeDB(currentDashBoard)}>(-)</button>
            ) : (
              <button onClick={() => addDB(currentDashBoard)}>(+)</button>
            )}
          </div>
        </div>
        {/* Widget Area */}
        <div className="box Widgets">
          {R.map(
            (widget) => (
              <div>{widget}</div>
            ),
            widgets
          )}
        </div>
        {/* Dashboards Area*/}
        <div className="box DBList">
          Dasbooard
          <div>
            <ul>{dbElements}</ul>
          </div>
        </div>
        {/* Slideshow Area */}
        {isShowing && (
          <div className="box SS">
            Slideshow
            <button type="button" onClick={hideSSBar}>
              [X]
            </button>
            {IDList}
          </div>
        )}
      </div>
    </Style>
  );
};

const Style = styled.section`
  font-family: Georgia, "Times New Roman", Times, serif;
  margin: 2em;
  color: rgb(0, 0, 0);
  font-style: oblique;
  background: rgb(0, 255, 255);

  ul {
    list-style-type: none;
  }

  .wrapper {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 200px 1fr 100px 100px;
    grid-template-rows: auto auto auto auto;
    background-color: #fff;
    color: #444;
  }

  .box {
    background-color: rgb(0, 255, 255);
    color: rgb(0, 0, 0);
    border-radius: 5px;
    padding: 5px;
    font-size: 100%;
  }

  .action {
    grid-column: 2 /30;
    grid-row: 1;
  }
  .DBList {
    grid-column: 1;
    grid-row: 1 / 50;
  }
  .DBTitle {
    grid-column: 2/ 30;
    grid-row: 2;
    display: flex;
    justify-content: space-between;
  }
  .Widgets {
    grid-column: 2/8;
    grid-row: 3/50;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 100px;
    grid-gap: 4px;
    > div {
      outline: 1px solid black;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .SS {
    grid-column: 8/30;
    grid-row: 3/50;
  }
`;
