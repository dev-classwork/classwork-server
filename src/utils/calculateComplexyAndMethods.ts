import axios from 'axios';

import CustomLinter from '../services/linter';
/*
interface TreeContent {
    mode: string;
    path: string;
    sha: string;
    size: number;
    type: string;
    url: string;
}

type Tree = TreeContent[];

export default async function calculateComplexyAndMethodValueOfDirectory(treeUrl: string, token: string | null){
    const com = await axios.get(treeUrl, {
        headers: {
            'Authorization': 'token ' + token
        }
    })

    let tree = com.data.tree as Tree;
    let value = await loadTree(tree, token, 0, 0) as [number, number];
    return value;
}

async function loadTree(tree: Tree, token: string | null, initialComplexity: number, initialMethodValue: number){
    var treeComplexity = initialComplexity;
    var treeMethods = initialMethodValue;

    for(let i in tree){
        if(tree[i].type === "tree"){
            let _values = await calculateComplexyAndMethodValueOfDirectory(tree[i].url, token);
            treeComplexity += _values[0];
            treeMethods += _values[1];
        }else{
            let _type = tree[i].path.split('.')
            let _typeItem = _type[_type.length- 1];

            const com = await axios.get(tree[i].url, {
                headers: {
                    "Authorization": "token " + sessionStorage.getItem('token')
                }
            });

            try{
                let _blob = base64.decode(com.data.content);
                _blob = utf8.decode(_blob);
                const Linter = new CustomLinter(_typeItem);
                const _dataResult = await Linter.verify(_blob);

                treeComplexity += Number(_dataResult.cyclomaticComplexityResult);
                treeMethods += Number(_dataResult.methods? _dataResult.methods.length:0);
            }catch{};
        }
    }
    
    return [treeComplexity, treeMethods];
}*/

export default async function calculateComplexyAndMethods(raw_url: string, token: string | null, filename: string){
    const content = await axios.get(raw_url, {
        headers: {
            'Authorization': 'token ' + token
        }
    })


    let _type = raw_url.split('.')
    let _typeItem = _type[_type.length- 1];

    const Linter = new CustomLinter(_typeItem);
    const _dataResult = await Linter.verify(content.data as string, filename);

    return [_dataResult.cyclomaticComplexity, _dataResult.methods? _dataResult.methods.length:0];
}


export async function calculateComplexyAndMethodsWithinToken(text: string, type: string, filename: string){
    const Linter = new CustomLinter(type);
    const _dataResult = await Linter.verify(text, filename);
    return [_dataResult.cyclomaticComplexity, _dataResult.methods? _dataResult.methods.length:0];
}

export async function linterVerify(text: string, filename: string){
    const Linter = new CustomLinter("");
    const _dataResult = await Linter.verify(text, filename);
    return _dataResult;
}