// This script works out which tests failed and injects an image tag pointing to the diff image path that
// was reported in the error message. This may break if jest-html-reporter or jest-image-snapshot changes,
// but this is good enough for us right now

document.addEventListener('DOMContentLoaded', () => {
    const parseImagePath = failureMsg =>
        failureMsg.match(/See diff for details:\s(.*)/)[1];

    const suitePaths = [...document.querySelectorAll('.suite-path')];
    const suiteTables = [...document.querySelectorAll('.suite-table')];

    suitePaths.forEach((_, i) => {
        const failureMsgNodes = [
            ...suiteTables[i].querySelectorAll('.failureMsg')
        ];

        failureMsgNodes.forEach(failureMsgNode => {
            const imagePath = parseImagePath(failureMsgNode.textContent);

            if (imagePath) {
                const div = document.createElement('div');
                div.style = 'margin-top: 16px';

                const a = document.createElement('a');
                a.href = `file:///${imagePath}`;
                a.target = '_blank';

                const img = document.createElement('img');
                img.src = `file:///${imagePath}`;
                img.style = 'width: 100%';

                a.appendChild(img);
                div.appendChild(a);
                failureMsgNode.appendChild(div);
            }
        });
    });
});
