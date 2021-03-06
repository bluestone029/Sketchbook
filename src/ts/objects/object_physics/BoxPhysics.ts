import * as CANNON from 'cannon';
import * as THREE from 'three';
import * as Utils from '../../core/Utilities';
import { IPhysicsType } from '../../interfaces/IPhysicsType';

export class BoxPhysics implements IPhysicsType
{
    public options: any;
    public physical: CANNON.Body;
    public visual: THREE.Mesh;
    
    constructor(options)
    {
        let defaults = {
            mass: 0,
            position: new THREE.Vector3(),
            size: new THREE.Vector3(0.3, 0.3, 0.3),
            friction: 0.3
        };
        options = Utils.setDefaults(options, defaults);
        this.options = options;

        options.position = new CANNON.Vec3(options.position.x, options.position.y, options.position.z);
        options.size = new CANNON.Vec3(options.size.x, options.size.y, options.size.z);

        let mat = new CANNON.Material("boxMat");
        mat.friction = options.friction;
        // mat.restitution = 0.7;

        let shape = new CANNON.Box(options.size);
        // shape.material = mat;

        // Add phys sphere
        let physBox = new CANNON.Body({
            mass: options.mass,
            position: options.position,
            shape
        });
        
        physBox.material = mat;

        this.physical = physBox;
        this.visual = this.getVisualModel({ visible: false, wireframe: true });
    }

    public getVisualModel(options): THREE.Mesh
    {
        let defaults = {
            visible: true,
            wireframe: true
        };
        options = Utils.setDefaults(options, defaults);

        let geometry = new THREE.BoxGeometry(this.options.size.x * 2, this.options.size.y * 2, this.options.size.z * 2);
        let material = new THREE.MeshLambertMaterial({ color: 0xcccccc, wireframe: options.wireframe });
        let visualBox = new THREE.Mesh(geometry, material);
        visualBox.visible = options.visible;
        if (!options.wireframe)
        {
            visualBox.castShadow = true;
            visualBox.receiveShadow = true;
        }

        return visualBox;
    }
}