export class PluginManager {


    constructor(){

        this.plugins = [];

    }



    register(plugin){


        this.plugins.push(
            plugin
        );


        return this;

    }



    async initialize(context){


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



    getPlugins(){


        return this.plugins;


    }



}
