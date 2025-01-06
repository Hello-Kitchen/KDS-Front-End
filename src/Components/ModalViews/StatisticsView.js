import React from "react";

/**
 * StatisticsView component displays various statistics related to the kitchen operations.
 * It includes sections for displaying graphs, average waiting times, number of orders, and number of clients.
 *
 * @component
 * @example
 * return (
 *   <StatisticsView />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function StatisticsView() {
    return (
        <div className="bg-kitchen-blue h-full border-kitchen-yellow border-y-2 flex flex-row items-center justify-center space-x-10">
            <div className="bg-white w-5/12 h-4/5 rounded">
                GRAPH
            </div>
            <div className="w-5/12 space-y-5">
                <div className="bg-white rounded-xl p-4">
                    <div className="text-2xl font-bold pb-1">Temps d&apos;attente</div>
                    <div className="text-l">Temps d&apos;attente moyen par plat : --:--</div>
                    <div className="text-l">Temps d&apos;attente moyen par commande : --:--</div>
                    <div className="text-l">Temps d&apos;attente moyen 1/4 d&apos;h par commmande : --:--</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                    <div className="text-2xl font-bold pb-1">Nombre de commandes</div>
                    <div className="text-l">Commandes en cours :</div>
                    <div className="pl-5 space-y-1">
                        <div className="bg-kitchen-green text-white px-3 w-fit rounded-lg">- commandes en dans les temps</div>
                        <div className="bg-kitchen-orange text-white px-3 w-fit rounded-lg">- commandes en retard</div>
                        <div className="bg-kitchen-red text-white px-3 w-fit rounded-lg">- commandes très en retard</div>
                        <div className="text-l">Total : - commandes</div>
                    </div>
                    <div className="text-l">Commandes au 1/4 d&apos;h : -</div>
                </div>
                <div className="bg-white rounded-xl p-4">
                    <div className="text-2xl font-bold pb-1">Nombre de clients</div>
                    <div className="text-l">Clients en salle : -</div>
                </div>
            </div>
        </div>
    );
}