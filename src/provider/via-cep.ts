import axios from "axios";
import { response } from "express";

export class ViaCepProvider {
    static async validateCEP(zipCode: string) : Promise<boolean>{
        const request = await axios.get(
            `https://viacep.com.br/ws/${zipCode}/json/`
        )

        if(request.data.erro){
            return false;
        }

        return true;
    }
}