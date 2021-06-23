import dateReturn from '../../src/utils/dateReturn';

require('dotenv').config();

describe(`\n   Utils Functions`, () => {
    it('Should be able to get date', () => {
        const date = dateReturn();

        expect(date).toHaveLength(21);
    })
});
