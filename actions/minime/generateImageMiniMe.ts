import { AppContext } from '../../apps/site.ts'

interface Props {
    product: string
}

const action = async (
    props: Props,
    _req: Request,
    _ctx: AppContext
) => {
    
    const response = await fetch("/_v/api/service/generateFinalImage", {
        method: "POST",
        body: props.product,
        headers: {
          accept: "application/json, text/java, */*; q=0.01",
          "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "application/json; charset=UTF-8"
        }
      });

      const data = await response.json()
    return data
}

export default action
