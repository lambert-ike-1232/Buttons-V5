import * as R from "ramda";

const dashBoards = {
  ABC123: { id: "ABC123", name: "DB1", widgets: ["widget A", "widget B"] },
  DEF234: { id: "DEF234", name: "DBD2", widgets: ["widget A", "widget B"] },
  HIJ345: { id: "ABC123", name: "DB1", widgets: ["widget A", "widget B"] },
  KLM456: { id: "DEF234", name: "DBD2", widgets: ["widget A", "widget B"] },
  QRS567: { id: "DEF234", name: "DBD2", widgets: ["widget A", "widget B"] }
};

R.pipe(
  R.keys,
  R.map((id) => {
    // id = "ABC123"
    const dashboard = R.prop(id, dashBoards); // prop("ABC123", dashBoards)=> {"id": "ABC123", "name": "DB1", "widgets": ["widget A", "widget B"]}
    //Accesses the Object ABC123 and allows us access to the "name" key
    const name = R.prop("name", dashboard); // prop("name", dashBoard) => "DB1"
    return `<button onClick= {()=>setCurrentDashBoard(${id})}>${name}</button>`;
  })
)(dashBoards);
//prop("ABC123", dashBoards)
