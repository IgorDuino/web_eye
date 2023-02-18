from app.applications.resources.models import Resource, ResourceNode
from app.applications.resources.schemas import (
    ResourceOut, ResourceCreate, ResourceUpdate, ResourceNodeOut, ResourceNodeCreate
)
from app.core.auth.utils.contrib import get_current_admin, get_current_user

from app.applications.users.models import User

from typing import List

from fastapi import APIRouter, HTTPException, Depends

from pydantic import UUID4

import logging


logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/", response_model=List[ResourceOut], status_code=200)
async def read_resources(
    skip: int = 0,
    limit: int = 100,
):
    """
    Get resource list.
    """
    resources = await Resource.all().limit(limit).offset(skip)
    
    return resources


@router.post("/", response_model=ResourceOut, status_code=201)
async def create_resource(
    resource_in: ResourceCreate
):
    """
    Create a resource
    """
    resource = await Resource.get_by_name(name=resource_in.name)
    
    if resource is not None:
        raise HTTPException(
            status_code=400,
            detail="The resource with this name allready exist",
        )
    
    resource = await Resource.create(**resource_in.dict())
    
    return resource


@router.get("/{uuid}", response_model=ResourceOut, status_code=200)
async def read_resource(
    uuid: UUID4,
):
    """
    Get resource by uuid.
    """
    resource = await Resource.filter(uuid=uuid).first()
    
    if resource is None:
        raise HTTPException(
            status_code=404,
            detail="The resource with this id does not exist",
        )
    
    return resource


@router.patch("/{uuid}", response_model=ResourceOut, status_code=201)
async def update_resource(
    uuid: UUID4,
    resource_in: ResourceUpdate
):
    """
    Update a resource
    """
    resource = await Resource.filter(uuid=uuid).first()
    
    if resource is None:
        raise HTTPException(
            status_code=404,
            detail="The resource with this name does not exist",
        )
    
    if resource_in.name is not None:   
        resource_name = await Resource.get_by_name(name=resource_in.name)
    
        if resource_name is not None:
            raise HTTPException(
                status_code=400,
                detail="The resource with this name allready exist",
            )

        resource.name = resource_in.name
        
    if resource_in.status is not None:
        resource.status = resource_in.status
        
    await resource.save()
    
    return resource


@router.get("/{uuid}/nodes", response_model=List[ResourceNodeOut], status_code=200)
async def read_resource_nodes(
    uuid: UUID4,
):
    """
    Get resource nodes by uuid.
    """
    resource = await Resource.filter(uuid=uuid).prefetch_related('nodes').first()
    
    if resource is None:
        raise HTTPException(
            status_code=404,
            detail="The resource with this id does not exist",
        )
    
    res = []
    for node in resource.nodes:
        res.append(node)
    
    return res


@router.post("/nodes", response_model=ResourceNodeOut, status_code=201)
async def create_node(
    resource_node_in: ResourceNodeCreate
):
    """
    Create a resource node
    """
    resource_node = await ResourceNode.filter(url=resource_node_in.url).first()
    
    if resource_node is not None:
        raise HTTPException(
            status_code=400,
            detail="The resource node with this url allready exist",
        )

    resource = await Resource.filter(uuid=resource_node_in.resource_uuid).first()
    
    if resource is None:
        raise HTTPException(
            status_code=404,
            detail="The resource with this id does not exist",
        )
    
    resource_node = await ResourceNode.create(
        url=resource_node_in.url, uuid=resource_node_in.uuid, resource=resource
    )
    
    return resource_node