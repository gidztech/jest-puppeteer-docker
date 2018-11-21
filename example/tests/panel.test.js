describe('Panel tests', async () => {
    beforeAll(async () => {
        await runSetup();
    });

    describe('Simple mode', async () => {
        const panelContainer = '.first-usage .panel';
        const panelTitle = '.first-usage .panel-title';
        const panelBody = '.first-usage .panel-body';

        it('title and body exist', async () => {
            await page.waitForSelector(panelTitle);
            const titleText = await extensions.getText(panelTitle);
            expect(titleText).toContain('My title');

            await page.waitForSelector(panelBody);
            const bodyText = await extensions.getText(panelBody);
            expect(bodyText).toContain('This is some test data');
        });

        it('title and body appear correctly', async () => {
            await visualCheck(panelContainer);
        });
    });

    describe('Icon mode', () => {
        const panelContainer = '.second-usage .panel';
        const panelTitle = '.second-usage .panel-title';
        const panelBody = '.second-usage .panel-body';

        it('title, body and icon exist', async () => {
            await page.waitForSelector(panelTitle);
            const titleText = await extensions.getText(panelTitle);
            expect(titleText).toContain('My title');

            await page.waitForSelector(panelBody);
            const bodyText = await extensions.getText(panelBody);
            expect(bodyText).toContain('This is a little bit more test data');
        });

        it('title, body and icon appear correctly', async () => {
            await visualCheck(panelContainer);
        });
    });
});
