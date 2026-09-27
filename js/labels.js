// Etichette delle zone agganciate alla mappa 3D: pulsanti HTML riposizionati a ogni fotogramma.
// Copiano icona e nome dal menu, che resta l'alternativa accessibile da tastiera.
import * as THREE from 'three';
import { zoneCenter } from './map.js';
import { toWorld } from './world.js';

export function createLabels(container, links, onPick) {
  const v = new THREE.Vector3();
  const pins = links.map((a) => {
    const id = a.dataset.zone;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pin';
    btn.tabIndex = -1;
    btn.dataset.zone = id;
    btn.style.cssText = a.style.cssText;
    btn.append(...[...a.childNodes].map((n) => n.cloneNode(true)));
    btn.addEventListener('click', () => onPick(id));
    container.append(btn);
    const { c, r } = zoneCenter(id);
    const { x, z } = toWorld(c, r);
    return { btn, id, pos: new THREE.Vector3(x, 2.6, z) };
  });

  return function update(camera, active) {
    for (const p of pins) {
      v.copy(p.pos).project(camera);
      const x = ((v.x + 1) / 2) * innerWidth;
      const y = ((1 - v.y) / 2) * innerHeight;
      p.btn.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%)`;
      p.btn.classList.toggle('active', p.id === active);
    }
  };
}
