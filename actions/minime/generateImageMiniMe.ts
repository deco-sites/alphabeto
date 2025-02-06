import { AppContext } from '../../apps/site.ts'

const action = async (
    prop: any,
    _req: Request,
    _ctx: AppContext
): Promise<any> => {
    const { vcsDeprecated } = _ctx;
    const {
        minime
    } = prop;
    
    const response = await vcsDeprecated["POST /_v/api/service/generateFinalImage"]
    (
        {
            body: { minime },
            headers: {
                accept: "application/json, text/java, */*; q=0.01",
                "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json; charset=UTF-8"
            },
        },
    );

    return response.json()
}

export default action
