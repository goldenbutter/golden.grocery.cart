#!/bin/bash
# Run this once from the backend folder to create the initial migration
cd backend/GoldenFreshCart.API
dotnet ef migrations add InitialCreate
dotnet ef database update
