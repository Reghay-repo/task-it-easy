const useSheetsFunction: string = `function doGet(req) {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var workspaceSheet = doc.getSheetByName("Workspace");
    var spacesSheet = doc.getSheetByName("Spaces");
    var tasksSheet = doc.getSheetByName("Tasks");
    var workspace = workspaceSheet.getDataRange().getValues();
    var spaces = spacesSheet.getDataRange().getValues();
    var tasks = tasksSheet.getDataRange().getValues();

    let spacesData = [];
    let tasksData = [];

    if(spaces[0][0] != "") {
      for (var i = 0; i < spaces.length; i++) {
          spacesData.push({
              id: spaces[i][0],
              name: spaces[i][1],
              showCompleted: spaces[i][2],
              color: spaces[i][3],
          });
      }
    }

    if(tasks[0][0] != "") {
      for (var i = 0; i < tasks.length; i++) {
          tasksData.push({
              id: tasks[i][0],
              title: tasks[i][1],
              description: tasks[i][2],
              deadline: tasks[i][3],
              frequency: tasks[i][4],
              checked: tasks[i][5],
              spaceId: tasks[i][6],
              notes: tasks[i][7],
          });
      }
    }

    const data = {
        id: workspace[0][0],
        name: workspace[0][1],
        createdAt: workspace[0][2],
        showCompletedInbox: workspace[0][3],
        showCompletedToday: workspace[0][4],
        showCompletedUpcoming: workspace[0][5],
        theme: workspace[0][6],
        accent: workspace[0][7],
        spaces: spacesData,
        tasks: tasksData,
        useSheets: workspace[0][8]
    };

    return ContentService.createTextOutput(JSON.stringify({ data: data, status: 200 })).setMimeType(
        ContentService.MimeType.JSON
    );
}

function doPost(e) {
    const body = e.postData.contents;
    const bodyJSON = JSON.parse(body);

    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var workspaceSheet = doc.getSheetByName("Workspace");
    var spacesSheet = doc.getSheetByName("Spaces");
    var tasksSheet = doc.getSheetByName("Tasks");
    workspaceSheet.clear();
    spacesSheet.clear();
    tasksSheet.clear();

    workspaceSheet.appendRow([
        bodyJSON.id,
        bodyJSON.name,
        bodyJSON.createdAt,
        bodyJSON.showCompletedInbox,
        bodyJSON.showCompletedToday,
        bodyJSON.showCompletedUpcoming,
        bodyJSON.theme,
        bodyJSON.accent,
        JSON.stringify(bodyJSON.useSheets)
    ]);

    for (var i = 0; i < bodyJSON.spaces.length; i++) {
        spacesSheet.appendRow([
            bodyJSON.spaces[i].id,
            bodyJSON.spaces[i].name,
            bodyJSON.spaces[i].showCompleted,
            JSON.stringify(bodyJSON.spaces[i].color),
        ]);
    }

    for (var i = 0; i < bodyJSON.tasks.length; i++) {
        tasksSheet.appendRow([
            bodyJSON.tasks[i].id,
            bodyJSON.tasks[i].title,
            bodyJSON.tasks[i].description,
            bodyJSON.tasks[i].deadline,
            bodyJSON.tasks[i].frequency,
            bodyJSON.tasks[i].checked,
            bodyJSON.tasks[i].spaceId,
            JSON.stringify(bodyJSON.tasks[i].notes),
        ]);
    }

    return ContentService.createTextOutput(JSON.stringify({ body: { status: 200 }})).setMimeType(
        ContentService.MimeType.JSON
    );
}
`;

export default useSheetsFunction;
