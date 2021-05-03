const devider = `
    <div style="border-bottom: solid 1px black;"></div>
`;

const getRowInfo = (row) => {
    let leadingTabs = 0;
    let value = '';

    if (!row) return { leadingTabs, value };

    const items = row.split('\t');
    items.forEach((item, index) => {
        if (item !== '') {
            leadingTabs = index;
            value = item;
            return false;
        }
    });
    return { leadingTabs, value };
};

const convertExcelToTree = (text) => {
    const rows = text.split('\n');

    let lastMap = null;
    const tree = rows.reduce((map, row, index) => {
        const rowInfo = getRowInfo(row);
        const nextRowInfo = getRowInfo(rows[index + 1]);

        const isPath = rowInfo.leadingTabs + 1 === nextRowInfo.leadingTabs;

        if (!lastMap) {
            lastMap = map;
        }

        if (isPath) {
            lastMap[rowInfo.value] = {};
            lastMap = lastMap[rowInfo.value];
        } else {
            lastMap[rowInfo.value] = rowInfo.value;
        }

        return map;
    }, {});
    console.log(tree)
};

const saveMarkdown = (text) => {
    const markdown = text.split('\n')
        .map(items => (
            items.split('\t')
                .map(item => (item === '') ? item : `- ${item}`)
                .join('\t')
        ))
        .join('\n');

    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(markdown));
    downloadLink.setAttribute('download', 'excel_to_markdown.md');
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};

const renderInput = (root) => {
    const inputContainer = document.createElement('div');
    inputContainer.id = 'input';
    inputContainer.innerHTML = `
        <p>
            <span>Parse Excel Table</span>
            <!-- <button id="convert">Convert</button> -->
            <button id="saveMD">Save Markdown</button>
        </p>
        ${devider}
        <br/>
        <textarea id="text-area" name="textarea" style="margin-left: 10%; width:80%; height: 300px"></textarea>
    `;
    root.appendChild(inputContainer);

    const inputText = inputContainer.querySelector('textarea');
    inputContainer.addEventListener('click', (event) => {
        const isConvertClicked = event.target.id === 'convert';
        if (isConvertClicked) {
            convertExcelToTree(inputText.value);
        }

        const isSaveMDClicked = event.target.id === 'saveMD';
        if (isSaveMDClicked) {
            saveMarkdown(inputText.value);
        }
    })
};

const renderTree = (root, treeData = null) => {
    if (root.querySelector('tree')) {
        root.removeChild(root.querySelector('tree'));
    }

    const treeContainer = document.createElement('div');
    treeContainer.id = 'tree';
    treeContainer.innerHTML = `
        <p>Result</p>
        ${devider}
        <br/>
        <div></div>
    `;
    root.appendChild(treeContainer);
};

const main = () => {
    const rootDiv = document.querySelector('#root');

    renderInput(rootDiv);
    // renderTree(rootDiv);
};

main();