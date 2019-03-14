describe('Panel tests', () => {
    beforeAll(async () => {
        await runSetup();
    });

    describe('Simple mode', () => {
        const panelContainer = '.first-usage .panel';
        const panelTitle = '.first-usage .panel-title';
        const panelBody = '.first-usage .panel-body';

        it('should have a title and body', async () => {
            await page.waitForSelector(panelTitle);
            const titleText = await extensions.getText(panelTitle);
            expect(titleText).toContain('My title');

            await page.waitForSelector(panelBody);
            const bodyText = await extensions.getText(panelBody);
            expect(bodyText).toContain('This is some test data');
        });

        it('should position the title and body correctly', async () => {
            await visualCheck(panelContainer);
        });
    });

    describe('Icon mode', () => {
        const panelContainer = '.second-usage .panel';
        const panelTitle = '.second-usage .panel-title';
        const panelBody = '.second-usage .panel-body';

        it('should have a title, body and icon', async () => {
            await page.waitForSelector(panelTitle);
            const titleText = await extensions.getText(panelTitle);
            expect(titleText).toContain('My title');

            await page.waitForSelector(panelBody);
            const bodyText = await extensions.getText(panelBody);
            expect(bodyText).toContain('This is a little bit more test data');
        });

        it('should position the title, body and icon correctly', async () => {
            await visualCheck(panelContainer);
        });
    });
});
