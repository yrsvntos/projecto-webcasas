import { useState, useEffect, useContext } from "react";
import { Container } from "../../components/container";
import { DashboardHeader } from "../../components/dashboardheader";

export default function Dashboard(){
    return(
        <Container>
            <DashboardHeader/>
        </Container>
    );
}
