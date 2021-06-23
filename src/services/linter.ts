import classworkLinter from 'dev-classwork-linter';

interface DataResult {
    qtdLines: number,
	qtdMethods: number,
	cyclomaticComplexity: number,
	token: number,
	methods: {
		name: string,
		longName: string,
		cyclomaticComplexity: number,
		startLine: number,
		endLine: number,
		parameters: string[],
		filename: string,
		topNestingLevel: number,
		length: number,
		fanIn: number,
		fanOut: number,
		generalFanOut: number,
	}[],
	source: string,
}

export default class CustomLinter {
    verify = async(source: string | string[], filename: string, config?: any) => {
        return {
            cyclomaticComplexity: 0,
            methods: [],
            qtdLines: 0,
            qtdMethods: 0,
            source: "",
            token: 0,
        } as DataResult;
    };

    constructor(language: string){
        switch(language.toLowerCase()){
            case("java"):
                this.verify = classworkLinter;
                break;
            default:
                this.verify = classworkLinter;
                break;
        }
    };
}