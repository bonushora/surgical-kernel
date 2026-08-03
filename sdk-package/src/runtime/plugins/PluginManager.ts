export interface Plugin {


    initialize?(

        context: unknown

    ): Promise<void> | void;


}



export class PluginManager {


    private plugins:Plugin[];



    constructor(){

        this.plugins = [];

    }



    register(

        plugin:Plugin

    ):this{


        this.plugins.push(
            plugin
        );


        return this;

    }



    async initialize(

        context:unknown

    ):Promise<void>{


        for(

            const plugin

            of this.plugins

        ){


            if(

                plugin.initialize

            ){

                await plugin.initialize(
                    context
                );

            }


        }


    }



    getPlugins():Plugin[]{


        return this.plugins;


    }


}
