(function () {
  'use strict';

  var canvas = document.getElementById('latticeCanvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var structureButtons = Array.prototype.slice.call(document.querySelectorAll('[data-structure]'));
  var parameter = document.getElementById('structureParameter');
  var wavelength = document.getElementById('probeWavelength');
  var probeAngle = document.getElementById('probeAngle');
  var latticeOrder = document.getElementById('latticeOrder');
  var parameterLabel = document.getElementById('parameterLabel');
  var parameterValue = document.getElementById('parameterValue');
  var wavelengthValue = document.getElementById('wavelengthValue');
  var angleValue = document.getElementById('angleValue');
  var orderValue = document.getElementById('orderValue');
  var modelTitle = document.getElementById('modelTitle');
  var modelFormula = document.getElementById('modelFormula');
  var modelCopy = document.getElementById('modelCopy');
  var unitCell = document.getElementById('unitCell');
  var mechanism = document.getElementById('mechanism');
  var emergence = document.getElementById('emergence');
  var stackRole = document.getElementById('stackRole');
  var strongestDirection = document.getElementById('strongestDirection');
  var coherenceValue = document.getElementById('coherenceValue');
  var status = document.getElementById('latticeStatus');
  var canvasKey = document.getElementById('canvasKey');

  var palette = {
    C: '#67e8f9', B: '#fbbf24', N: '#a78bfa', Co: '#fb7185', Sn: '#cbd5e1',
    W: '#60a5fa', Se: '#fbbf24', Mo: '#f472b6', Fe: '#fb7185', Ti: '#38bdf8',
    Si: '#fde047', O: '#f472b6'
  };

  var models = {
    honeycomb: {
      title: 'Honeycomb sheet', formula: 'C / BN',
      copy: 'A hexagonal network becomes either a conducting carbon sheet or a polar dielectric when the two sublattices carry different atoms.',
      unit: 'Two sites on a hexagonal Bravais lattice',
      mechanism: 'Sublattice equivalence or contrast changes the allowed electronic bands.',
      emergence: 'High in-plane transport, heat spreading or electrical isolation.',
      role: 'Conductive heat spreader beside an atomically flat dielectric separator.',
      param: { label: 'Scattering-contrast proxy', min: 0, max: 100, step: 1, value: 0, suffix: '%' },
      vectors: [[1, 0], [0.5, 0.8660254]],
      basis: [
        { uv: [0, 0], species: 'C', weight: 1, shape: 'circle' },
        { uv: [1 / 3, 1 / 3], species: 'C', weight: 1, shape: 'diamond', alternate: true }
      ]
    },
    kagome: {
      title: 'Magnetic Kagome sheet', formula: 'Co3Sn2S2 / Fe3Sn2',
      copy: 'Corner-sharing triangles create geometrical frustration, flat-band pathways and a strong relationship between magnetism, Berry curvature and optical response.',
      unit: 'Three magnetic sites on a triangular Bravais lattice',
      mechanism: 'Path interference and broken time-reversal symmetry reshape the electronic bands.',
      emergence: 'Anomalous Hall transport, Weyl states and strong Kerr or Faraday rotation.',
      role: 'Magneto-optical phase layer and directional surface-current router.',
      param: { label: 'Third-site scattering contrast', min: 0, max: 100, step: 1, value: 72, suffix: '%' },
      vectors: [[1, 0], [0.5, 0.8660254]],
      basis: [
        { uv: [0, 0], species: 'Co', weight: 1, shape: 'circle' },
        { uv: [0.5, 0], species: 'Co', weight: 1, shape: 'circle' },
        { uv: [0, 0.5], species: 'Co', weight: 1, shape: 'circle', alternate: true }
      ]
    },
    moire: {
      title: 'Twisted TMD bilayer', formula: 'WSe2 / MoSe2',
      copy: 'Two atom-thin hexagonal sheets create a larger moire superlattice when their lattice constants or angles differ. The canvas maps the registry envelope and a small atomic inset; the new period changes localisation and electronic bandwidth.',
      unit: 'Two overlaid hexagonal lattices with adjustable registry',
      mechanism: 'Interlayer hybridisation and the moire potential create new minibands and localised states.',
      emergence: 'Flat bands, correlated states, confined excitons and tunable optical response.',
      role: 'Voltage-addressed quantum and optical control layer.',
      param: { label: 'Twist angle', min: 0.5, max: 5, step: 0.1, value: 1.1, suffix: '°' },
      special: 'moire'
    },
    bct: {
      title: 'Body-centred tetragonal iron nitride', formula: 'alpha double-prime Fe16N2',
      copy: 'Ordered nitrogen expands and distorts the iron lattice along one axis. That registry changes the iron orbital environment and magnetic exchange.',
      unit: 'Projected BCT cell with ordered Fe and N sites',
      mechanism: 'Tetragonal distortion and ordered nitrogen change 3d orbital overlap and spin alignment.',
      emergence: 'High magnetic moment density and rare-earth-free flux guidance.',
      role: 'Segmented magnetic reference and field-shaping layer.',
      param: { label: 'Tetragonal c/a ratio', min: 1, max: 1.2, step: 0.01, value: 1.10, suffix: '' },
      vectors: [[1, 0], [0, 1.1]],
      basis: [
        { uv: [0, 0], species: 'Fe', weight: 1.15, shape: 'circle' },
        { uv: [0.5, 0.5], species: 'Fe', weight: 1.15, shape: 'circle' },
        { uv: [0.5, 0], species: 'N', weight: 0.68, shape: 'diamond' }
      ]
    },
    max: {
      title: 'MAX nanolaminate', formula: 'Ti3SiC2',
      copy: 'Rigid titanium-carbon slabs alternate with single silicon planes. Strong ceramic blocks and easier-slip atomic layers coexist in one ordered crystal.',
      unit: 'Layered hexagonal carbide, shown as a side projection',
      mechanism: 'Strong M-X octahedra carry heat and load while A-layers allow kink and slip deformation.',
      emergence: 'Thermal-shock tolerance with electrical conduction and metal-like machinability.',
      role: 'Transition layer between ceramic outer faces and a tougher load shell.',
      param: { label: 'A-layer slip', min: 0, max: 100, step: 1, value: 18, suffix: '%' },
      special: 'max'
    },
    moo3: {
      title: 'Orthorhombic polariton crystal', formula: 'alpha-MoO3',
      copy: 'The in-plane crystal axes carry different dielectric responses. Infrared phonon-polaritons therefore travel in narrow, direction-dependent paths.',
      unit: 'Orthorhombic van der Waals layer, shown in projection',
      mechanism: 'Opposite-sign permittivity components create in-plane hyperbolic propagation.',
      emergence: 'Deeply confined, anisotropic and steerable infrared polariton rays.',
      role: 'Directional infrared routing layer inside an adaptive thermal stack.',
      param: { label: 'Projected lattice aspect', min: 1, max: 2.5, step: 0.05, value: 1.75, suffix: ':1' },
      vectors: [[1.4, 0], [0, 1]],
      basis: [
        { uv: [0, 0], species: 'Mo', weight: 1.2, shape: 'square' },
        { uv: [0.5, 0.25], species: 'O', weight: 0.72, shape: 'circle' },
        { uv: [0.5, 0.75], species: 'O', weight: 0.72, shape: 'circle' }
      ]
    }
  };

  var activeKey = 'honeycomb';

  function fract(value) { return value - Math.floor(value); }

  function deterministicNoise(index, axis) {
    return fract(Math.sin((index + 1) * 12.9898 + axis * 78.233) * 43758.5453) * 2 - 1;
  }

  function rotate(point, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    return [point[0] * c - point[1] * s, point[0] * s + point[1] * c];
  }

  function buildBravais(model, paramValue, order) {
    var vectors = model.vectors.map(function (v) { return [v[0], v[1]]; });
    if (activeKey === 'bct') vectors[1][1] = paramValue;
    if (activeKey === 'moo3') vectors[0][0] = paramValue;
    var points = [];
    var n = 4;
    for (var u = -n; u <= n; u += 1) {
      for (var v = -n; v <= n; v += 1) {
        model.basis.forEach(function (site) {
          var species = site.species;
          var weight = site.weight;
          if (activeKey === 'honeycomb' && site.alternate) {
            species = paramValue === 0 ? 'C' : 'N';
            weight = 1 + paramValue * 0.003;
          }
          if (activeKey === 'honeycomb' && !site.alternate && paramValue > 0) {
            species = 'B';
            weight = 1 - paramValue * 0.002;
          }
          if (activeKey === 'kagome' && site.alternate) weight = 0.5 + paramValue * 0.005;
          var fu = u + site.uv[0];
          var fv = v + site.uv[1];
          points.push({
            x: fu * vectors[0][0] + fv * vectors[1][0],
            y: fu * vectors[0][1] + fv * vectors[1][1],
            species: species,
            weight: weight,
            shape: site.shape,
            group: 0
          });
        });
      }
    }
    return applyDisorder(points, order);
  }

  function buildMoire(angleDeg, order) {
    var points = [];
    var n = 5;
    var a1 = [[1, 0], [0.5, 0.8660254]];
    var scales = [1, 1.00305];
    var species = ['W', 'Mo'];
    var angles = [-angleDeg * Math.PI / 360, angleDeg * Math.PI / 360];
    for (var layer = 0; layer < 2; layer += 1) {
      for (var u = -n; u <= n; u += 1) {
        for (var v = -n; v <= n; v += 1) {
          var raw = [
            (u * a1[0][0] + v * a1[1][0]) * scales[layer],
            (u * a1[0][1] + v * a1[1][1]) * scales[layer]
          ];
          var turned = rotate(raw, angles[layer]);
          points.push({ x: turned[0], y: turned[1], species: species[layer], weight: 1 + layer * 0.16, shape: layer ? 'diamond' : 'circle', group: layer });
        }
      }
    }
    return applyDisorder(points, order);
  }

  function moirePeriod(angleDeg) {
    var theta = angleDeg * Math.PI / 180;
    var a1 = 0.328;
    var a2 = 0.329;
    var mean = (a1 + a2) / 2;
    var mismatch = (a2 - a1) / mean;
    var units = 1 / Math.sqrt(mismatch * mismatch + theta * theta);
    return { units: units, nm: mean * units };
  }

  function buildMoireScattering(angleDeg, order) {
    var period = moirePeriod(angleDeg).units;
    var points = [];
    var n = 3;
    var sigma = (1 - order / 100) * period * 0.04;
    var basis = [
      { uv: [0, 0], weight: 1.2 },
      { uv: [1 / 3, 1 / 3], weight: 0.9 },
      { uv: [2 / 3, 2 / 3], weight: 0.75 }
    ];
    for (var u = -n; u <= n; u += 1) {
      for (var v = -n; v <= n; v += 1) {
        basis.forEach(function (site) {
          var fu = u + site.uv[0];
          var fv = v + site.uv[1];
          var index = points.length;
          points.push({
            x: period * (fu + 0.5 * fv) + deterministicNoise(index, 0) * sigma,
            y: period * 0.8660254 * fv + deterministicNoise(index, 1) * sigma,
            species: 'W', weight: site.weight, shape: 'circle', group: 0
          });
        });
      }
    }
    return points;
  }

  function buildMax(slipPercent, order) {
    var points = [];
    var nX = 9;
    var rows = [
      { y: -1.6, species: 'Ti', shift: 0 },
      { y: -1.2, species: 'C', shift: 0.5 },
      { y: -0.8, species: 'Ti', shift: 0 },
      { y: -0.25, species: 'Si', shift: slipPercent / 100 * 0.5 },
      { y: 0.3, species: 'Ti', shift: 0 },
      { y: 0.7, species: 'C', shift: 0.5 },
      { y: 1.1, species: 'Ti', shift: 0 },
      { y: 1.65, species: 'Si', shift: slipPercent / 100 * 0.5 }
    ];
    rows.forEach(function (row, rowIndex) {
      for (var x = -nX; x <= nX; x += 1) {
        points.push({
          x: x * 0.52 + row.shift,
          y: row.y,
          species: row.species,
          weight: row.species === 'Ti' ? 1.15 : row.species === 'Si' ? 0.9 : 0.72,
          shape: row.species === 'Si' ? 'diamond' : 'circle',
          group: rowIndex
        });
      }
    });
    return applyDisorder(points, order);
  }

  function applyDisorder(points, order) {
    var sigma = (1 - order / 100) * 0.22;
    return points.map(function (point, index) {
      return {
        x: point.x + deterministicNoise(index, 0) * sigma,
        y: point.y + deterministicNoise(index, 1) * sigma,
        species: point.species,
        weight: point.weight,
        shape: point.shape,
        group: point.group
      };
    });
  }

  function getPoints(model, paramValue, order) {
    if (model.special === 'moire') return buildMoire(paramValue, order);
    if (model.special === 'max') return buildMax(paramValue, order);
    return buildBravais(model, paramValue, order);
  }

  function getScatteringPoints(model, paramValue, order, displayPoints) {
    if (model.special === 'moire') return buildMoireScattering(paramValue, order);
    return displayPoints;
  }

  function bounds(points) {
    var xs = points.map(function (p) { return p.x; });
    var ys = points.map(function (p) { return p.y; });
    return { minX: Math.min.apply(null, xs), maxX: Math.max.apply(null, xs), minY: Math.min.apply(null, ys), maxY: Math.max.apply(null, ys) };
  }

  function canvasSize() {
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(320, Math.round(rect.width));
    var h = Math.max(320, Math.round(rect.height));
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w: w, h: h };
  }

  function drawShape(x, y, size, shape, colour, label) {
    ctx.beginPath();
    if (shape === 'diamond') {
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
    } else if (shape === 'square') {
      ctx.rect(x - size * 0.78, y - size * 0.78, size * 1.56, size * 1.56);
    } else {
      ctx.arc(x, y, size, 0, Math.PI * 2);
    }
    ctx.fillStyle = colour;
    ctx.fill();
    ctx.strokeStyle = 'rgba(4,6,12,.9)';
    ctx.lineWidth = 1;
    ctx.stroke();
    if (size >= 6.5) {
      ctx.fillStyle = '#04060c';
      ctx.font = '600 7px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label.slice(0, 2), x, y + 0.5);
    }
  }

  function nearestDistance(points, group) {
    var sample = points.filter(function (p) { return group === undefined || p.group === group; }).slice(0, 70);
    var nearest = Infinity;
    for (var i = 0; i < sample.length; i += 1) {
      for (var j = i + 1; j < sample.length; j += 1) {
        var dx = sample[i].x - sample[j].x;
        var dy = sample[i].y - sample[j].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d > 0.08 && d < nearest) nearest = d;
      }
    }
    return nearest;
  }

  function drawRealSpace(points, area, model) {
    if (activeKey === 'moire') {
      drawMoireEnvelope(area, Number(parameter.value), Number(latticeOrder.value));
      return;
    }
    var box = bounds(points);
    var pad = 34;
    var scale = Math.min((area.w - pad * 2) / (box.maxX - box.minX || 1), (area.h - pad * 2) / (box.maxY - box.minY || 1));
    var centreX = area.x + area.w / 2;
    var centreY = area.y + area.h / 2 + 8;
    var midX = (box.minX + box.maxX) / 2;
    var midY = (box.minY + box.maxY) / 2;
    function sx(x) { return centreX + (x - midX) * scale; }
    function sy(y) { return centreY + (y - midY) * scale; }

    var groups = {};
    points.forEach(function (p) { groups[p.group] = true; });
    Object.keys(groups).forEach(function (groupKey) {
      var group = Number(groupKey);
      var nearest = nearestDistance(points, group);
      var groupPoints = points.filter(function (p) { return p.group === group; });
      ctx.strokeStyle = group % 2 ? 'rgba(251,191,36,.16)' : 'rgba(103,232,249,.16)';
      ctx.lineWidth = 1;
      for (var i = 0; i < groupPoints.length; i += 1) {
        for (var j = i + 1; j < groupPoints.length; j += 1) {
          var dx = groupPoints[i].x - groupPoints[j].x;
          var dy = groupPoints[i].y - groupPoints[j].y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d <= nearest * 1.06) {
            ctx.beginPath();
            ctx.moveTo(sx(groupPoints[i].x), sy(groupPoints[i].y));
            ctx.lineTo(sx(groupPoints[j].x), sy(groupPoints[j].y));
            ctx.stroke();
          }
        }
      }
    });

    var size = Math.max(3, Math.min(7.5, scale * 0.12));
    points.forEach(function (p) {
      drawShape(sx(p.x), sy(p.y), size, p.shape, palette[p.species] || '#f2f5ff', p.species);
    });

    ctx.fillStyle = '#93a3c4';
    ctx.font = '600 10px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('ACTIVE-SUBLATTICE SCHEMATIC', area.x + 14, area.y + 20);

    var phi = Number(probeAngle.value) * Math.PI / 180;
    var arrowLength = Math.min(70, area.w * 0.17);
    var ax = area.x + 28;
    var ay = area.y + area.h - 26;
    ctx.strokeStyle = '#fbbf24';
    ctx.fillStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax + Math.cos(phi) * arrowLength, ay - Math.sin(phi) * arrowLength);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ax + Math.cos(phi) * arrowLength, ay - Math.sin(phi) * arrowLength, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawMoireEnvelope(area, angleDeg, order) {
    var cols = 42;
    var rows = Math.max(22, Math.round(cols * area.h / area.w));
    var cellW = area.w / cols;
    var cellH = area.h / rows;
    var contrast = 0.28 + order / 100 * 0.72;
    for (var row = 0; row < rows; row += 1) {
      for (var col = 0; col < cols; col += 1) {
        var x = (col / (cols - 1) - 0.5) * 2.8;
        var y = (row / (rows - 1) - 0.5) * 2.8;
        var phase1 = Math.PI * 2 * x;
        var phase2 = Math.PI * 2 * (0.5 * x + 0.8660254 * y);
        var phase3 = Math.PI * 2 * (-0.5 * x + 0.8660254 * y);
        var registry = (Math.cos(phase1) + Math.cos(phase2) + Math.cos(phase3)) / 3;
        var alpha = (0.035 + Math.pow((registry + 1) / 2, 2) * 0.32) * contrast;
        ctx.fillStyle = registry > 0.2 ? 'rgba(103,232,249,' + alpha.toFixed(3) + ')' : 'rgba(251,191,36,' + (alpha * 0.62).toFixed(3) + ')';
        ctx.fillRect(area.x + col * cellW, area.y + row * cellH, cellW + 1, cellH + 1);
      }
    }

    ctx.fillStyle = '#93a3c4';
    ctx.font = '600 10px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('MOIRÉ REGISTRY SUPERLATTICE', area.x + 14, area.y + 20);
    var period = moirePeriod(angleDeg);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('L ≈ ' + period.nm.toFixed(1) + ' nm · ' + period.units.toFixed(0) + ' atomic spacings', area.x + 14, area.y + 37);

    var insetW = Math.min(170, area.w * 0.46);
    var insetH = Math.min(112, area.h * 0.31);
    var insetX = area.x + 14;
    var insetY = area.y + area.h - insetH - 14;
    ctx.fillStyle = 'rgba(7,11,21,.88)';
    ctx.fillRect(insetX, insetY, insetW, insetH);
    ctx.strokeStyle = 'rgba(147,163,196,.3)';
    ctx.strokeRect(insetX, insetY, insetW, insetH);
    var centreX = insetX + insetW / 2;
    var centreY = insetY + insetH / 2 + 6;
    var turn = angleDeg * Math.PI / 360;
    [-turn, turn].forEach(function (layerAngle, layerIndex) {
      for (var u = -4; u <= 4; u += 1) {
        for (var v = -3; v <= 3; v += 1) {
          var raw = [u * 13 + v * 6.5, v * 11.258];
          var point = rotate(raw, layerAngle);
          ctx.beginPath();
          ctx.arc(centreX + point[0], centreY + point[1], 1.7, 0, Math.PI * 2);
          ctx.fillStyle = layerIndex ? 'rgba(251,191,36,.72)' : 'rgba(96,165,250,.72)';
          ctx.fill();
        }
      }
    });
    ctx.fillStyle = '#93a3c4';
    ctx.font = '600 8px JetBrains Mono, monospace';
    ctx.fillText('ATOMIC REGISTRY INSET', insetX + 7, insetY + 11);
  }

  function structureFactor(points, lambda, incidentDeg) {
    var incident = incidentDeg * Math.PI / 180;
    var k = Math.PI * 2 / lambda;
    var kInX = k * Math.cos(incident);
    var kInY = k * Math.sin(incident);
    var values = [];
    for (var deg = 0; deg < 360; deg += 3) {
      var angle = deg * Math.PI / 180;
      var qx = k * Math.cos(angle) - kInX;
      var qy = k * Math.sin(angle) - kInY;
      var real = 0;
      var imag = 0;
      var totalWeight = 0;
      points.forEach(function (p) {
        var phase = qx * p.x + qy * p.y;
        real += p.weight * Math.cos(phase);
        imag += p.weight * Math.sin(phase);
        totalWeight += Math.abs(p.weight);
      });
      var intensity = (real * real + imag * imag) / Math.pow(totalWeight || 1, 2);
      values.push({ deg: deg, intensity: intensity });
    }
    return values;
  }

  function angularGap(a, b) {
    var gap = Math.abs(a - b) % 360;
    return Math.min(gap, 360 - gap);
  }

  function drawScattering(values, area, incidentDeg) {
    var cx = area.x + area.w / 2;
    var cy = area.y + area.h / 2 + 8;
    var maxR = Math.min(area.w, area.h) * 0.38;
    var maxI = Math.max.apply(null, values.filter(function (value) {
      return angularGap(value.deg, incidentDeg) > 9;
    }).map(function (value) { return value.intensity; })) || 1;

    ctx.strokeStyle = 'rgba(147,163,196,.2)';
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75, 1].forEach(function (f) {
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * f, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.moveTo(cx - maxR, cy);
    ctx.lineTo(cx + maxR, cy);
    ctx.moveTo(cx, cy - maxR);
    ctx.lineTo(cx, cy + maxR);
    ctx.stroke();

    ctx.beginPath();
    values.forEach(function (value, index) {
      var a = value.deg * Math.PI / 180;
      var plotted = angularGap(value.deg, incidentDeg) <= 9 ? 0 : value.intensity;
      var r = Math.sqrt(Math.min(1, plotted / maxI)) * maxR;
      var x = cx + Math.cos(a) * r;
      var y = cy - Math.sin(a) * r;
      if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(103,232,249,.19)';
    ctx.strokeStyle = '#67e8f9';
    ctx.lineWidth = 1.6;
    ctx.fill();
    ctx.stroke();

    var direct = incidentDeg * Math.PI / 180;
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(direct) * maxR, cy - Math.sin(direct) * maxR);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(cx + Math.cos(direct) * maxR, cy - Math.sin(direct) * maxR, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#93a3c4';
    ctx.font = '600 10px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('SCALAR INTERFERENCE ROSE', area.x + 14, area.y + 20);
    ctx.textAlign = 'center';
    ctx.fillText('0°', cx + maxR + 12, cy + 3);
    ctx.fillText('90°', cx, cy - maxR - 8);
  }

  function strongestPeaks(values, incidentDeg) {
    var local = values.filter(function (candidate, index) {
      var previous = values[(index - 1 + values.length) % values.length];
      var next = values[(index + 1) % values.length];
      return angularGap(candidate.deg, incidentDeg) > 9 && candidate.intensity >= previous.intensity && candidate.intensity > next.intensity;
    });
    var sorted = local.sort(function (a, b) { return b.intensity - a.intensity; });
    var peaks = [];
    sorted.forEach(function (candidate) {
      if (peaks.length >= 3) return;
      var separated = peaks.every(function (existing) {
        return angularGap(existing.deg, candidate.deg) >= 15;
      });
      if (separated) peaks.push(candidate);
    });
    var top = peaks[0] ? peaks[0].intensity : 1;
    return peaks.map(function (p) { return { deg: p.deg, relative: Math.round(p.intensity / top * 100) }; });
  }

  function speciesKey(points) {
    var found = [];
    points.forEach(function (p) { if (found.indexOf(p.species) < 0) found.push(p.species); });
    canvasKey.innerHTML = found.map(function (name) {
      return '<span class="key-item"><span class="key-dot" style="--dot:' + (palette[name] || '#f2f5ff') + '"></span>' + name + '</span>';
    }).join('') + '<span class="key-item">Rose radius = square root of relative diffracted intensity</span><span class="key-item">Gold dashed line = direct beam</span>';
  }

  function stateDescription(key, paramValue, coherence, peaks) {
    var lead = peaks[0] ? peaks[0].deg + '°' : 'none';
    if (key === 'honeycomb') {
      return paramValue === 0
        ? '<strong>Graphene-like state:</strong> equivalent sublattices preserve the honeycomb symmetry. Strongest diffracted peak: ' + lead + '.'
        : '<strong>Contrast interpolation:</strong> representative B-like and N-like site weights differ by ' + Math.round(paramValue) + '% of the model range while retaining the hexagonal geometry. Strongest diffracted peak: ' + lead + '.';
    }
    if (key === 'kagome') return '<strong>Kagome geometry:</strong> corner-sharing triangles create several interference paths. The third-site scalar scattering contrast is ' + Math.round(paramValue) + '%; the material note carries the related magnetic band physics.';
    if (key === 'moire') {
      var period = moirePeriod(paramValue);
      return '<strong>Moire state:</strong> ' + paramValue.toFixed(1) + '° twist creates an approximate superlattice period of ' + period.nm.toFixed(1) + ' nm and updates the WSe2-MoSe2 stack rule.';
    }
    if (key === 'bct') return '<strong>BCT state:</strong> c/a = ' + paramValue.toFixed(2) + ' changes the ordered Fe-N orbital environment.';
    if (key === 'max') return '<strong>MAX state:</strong> the Si plane is offset by ' + Math.round(paramValue) + '% of the model slip range between Ti-C slabs.';
    return '<strong>Orthorhombic projection:</strong> the drawn lattice aspect is ' + paramValue.toFixed(2) + ':1. Hyperbolic polariton flow depends separately on the frequency-dependent permittivity tensor.';
  }

  function render(announce) {
    var model = models[activeKey];
    var paramValue = Number(parameter.value);
    var order = Number(latticeOrder.value);
    var lambda = Number(wavelength.value);
    var angle = Number(probeAngle.value);
    var points = getPoints(model, paramValue, order);
    var scatteringPoints = getScatteringPoints(model, paramValue, order, points);
    var values = structureFactor(scatteringPoints, lambda, angle);
    var peaks = strongestPeaks(values, angle);
    var sigma = (1 - order / 100) * (activeKey === 'moire' ? moirePeriod(paramValue).units * 0.04 : 0.22);
    var coherence = Math.exp(-Math.pow(Math.PI * 2 * sigma / lambda, 2));
    var size = canvasSize();

    ctx.clearRect(0, 0, size.w, size.h);
    ctx.fillStyle = '#070b15';
    ctx.fillRect(0, 0, size.w, size.h);
    ctx.strokeStyle = 'rgba(44,60,107,.75)';
    if (size.w < 600) {
      var rowSplit = Math.round(size.h * 0.54);
      ctx.beginPath();
      ctx.moveTo(0, rowSplit);
      ctx.lineTo(size.w, rowSplit);
      ctx.stroke();
      drawRealSpace(points, { x: 0, y: 0, w: size.w, h: rowSplit }, model);
      drawScattering(values, { x: 0, y: rowSplit, w: size.w, h: size.h - rowSplit }, angle);
    } else {
      var columnSplit = Math.round(size.w * 0.56);
      ctx.beginPath();
      ctx.moveTo(columnSplit, 0);
      ctx.lineTo(columnSplit, size.h);
      ctx.stroke();
      drawRealSpace(points, { x: 0, y: 0, w: columnSplit, h: size.h }, model);
      drawScattering(values, { x: columnSplit, y: 0, w: size.w - columnSplit, h: size.h }, angle);
    }
    speciesKey(points);

    parameterValue.textContent = formatParam(model.param, paramValue);
    wavelengthValue.textContent = activeKey === 'moire'
      ? lambda.toFixed(0) + ' a (' + (lambda / moirePeriod(paramValue).units).toFixed(2) + ' L)'
      : lambda.toFixed(1) + ' a';
    angleValue.textContent = Math.round(angle) + '°';
    orderValue.textContent = Math.round(order) + '%';
    strongestDirection.textContent = peaks.length ? peaks.map(function (p) { return p.deg + '° (' + p.relative + '%)'; }).join(', ') : 'Local diffracted peaks fall below this angular sampling step.';
    coherenceValue.textContent = Math.round(coherence * 100) + '% wavelength-relative positional-order proxy.';
    if (activeKey === 'moire') {
      document.documentElement.setAttribute('data-moire-twist', paramValue.toFixed(2));
      document.dispatchEvent(new CustomEvent('moirechange', { detail: { angle: paramValue, period: moirePeriod(paramValue) } }));
    }
    if (announce) status.innerHTML = stateDescription(activeKey, paramValue, coherence, peaks);
  }

  function formatParam(config, value) {
    var decimals = config.step < 0.1 ? 2 : config.step < 1 ? 1 : 0;
    return Number(value).toFixed(decimals) + config.suffix;
  }

  function chooseModel(key) {
    activeKey = key;
    var model = models[key];
    structureButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-structure') === key ? 'true' : 'false');
    });
    modelTitle.textContent = model.title;
    modelFormula.textContent = model.formula;
    modelCopy.textContent = model.copy;
    unitCell.textContent = model.unit;
    mechanism.textContent = model.mechanism;
    emergence.textContent = model.emergence;
    stackRole.textContent = model.role;
    parameterLabel.textContent = model.param.label;
    parameter.min = model.param.min;
    parameter.max = model.param.max;
    parameter.step = model.param.step;
    parameter.value = model.param.value;
    if (key === 'moire') {
      wavelength.min = 2;
      wavelength.max = 80;
      wavelength.step = 1;
      wavelength.value = 20;
    } else {
      wavelength.min = 0.7;
      wavelength.max = 6;
      wavelength.step = 0.1;
      wavelength.value = 2.4;
    }
    render(true);
  }

  structureButtons.forEach(function (button) {
    button.addEventListener('click', function () { chooseModel(button.getAttribute('data-structure')); });
  });

  [parameter, wavelength, probeAngle, latticeOrder].forEach(function (control) {
    control.addEventListener('input', function () { render(false); });
    control.addEventListener('change', function () { render(true); });
  });

  window.addEventListener('resize', function () { render(false); });
  chooseModel('honeycomb');
})();

(function () {
  'use strict';

  var stackList = document.getElementById('stackList');
  if (!stackList) return;

  var layerSelect = document.getElementById('layerSelect');
  var addLayer = document.getElementById('addLayer');
  var stackCrossSection = document.getElementById('stackCrossSection');
  var interfaceResistance = document.getElementById('interfaceResistance');
  var interfaceValue = document.getElementById('interfaceValue');
  var parallelThermal = document.getElementById('parallelThermal');
  var perpendicularThermal = document.getElementById('perpendicularThermal');
  var sheetConductance = document.getElementById('sheetConductance');
  var roleMap = document.getElementById('roleMap');
  var synergyList = document.getElementById('synergyList');
  var stackStatus = document.getElementById('stackStatus');
  var presetButtons = Array.prototype.slice.call(document.querySelectorAll('[data-stack-preset]'));

  var roles = [
    ['mechanical', 'Mechanical'],
    ['heat', 'Heat'],
    ['electrical', 'Electrical'],
    ['optical', 'Optical'],
    ['magnetic', 'Magnetic'],
    ['quantum', 'Quantum'],
    ['memory', 'Memory']
  ];

  var layers = {
    rhea: { name: 'Refractory high-entropy alloy', formula: 'Ta-Nb-Hf-Zr-Ti', colour: '#fb7185', thickness: 800, kpar: 20, kperp: 15, sigma: 6e5, roles: [5, 3, 2, 0, 0.5, 0, 0] },
    max: { name: 'MAX phase', formula: 'Ti3SiC2', colour: '#38bdf8', thickness: 600, kpar: 37, kperp: 20, sigma: 4e6, roles: [4.5, 4, 3.5, 0, 0, 0, 0] },
    mxene: { name: 'MXene', formula: 'Mo2TiC2Tx', colour: '#60a5fa', thickness: 50, kpar: 50, kperp: 5, sigma: 1e5, roles: [2.5, 3.5, 4, 1, 1.5, 0.5, 1] },
    graphene: { name: 'Graphene', formula: 'C', colour: '#67e8f9', thickness: 5, kpar: 1500, kperp: 6, sigma: 1e6, roles: [3, 5, 5, 2.5, 0.5, 2, 0] },
    hbn: { name: 'Hexagonal boron nitride', formula: 'h-BN', colour: '#fbbf24', thickness: 10, kpar: 400, kperp: 3, sigma: 1e-10, roles: [2.5, 4, 0, 2.5, 0, 3, 0] },
    borophene: { name: 'Borophene', formula: 'B sheet', colour: '#fde047', thickness: 5, kpar: 150, kperp: 20, sigma: 1e6, roles: [4.5, 3.5, 4.5, 1, 0, 1, 0] },
    wse2: { name: 'Tungsten diselenide', formula: 'WSe2', colour: '#a78bfa', thickness: 0.7, kpar: 50, kperp: 2, sigma: 1e-4, roles: [1, 2, 1.5, 4.5, 0, 4.5, 0.5] },
    mose2: { name: 'Molybdenum diselenide', formula: 'MoSe2', colour: '#f472b6', thickness: 0.7, kpar: 40, kperp: 2, sigma: 1e-4, roles: [1, 2, 1.5, 4.5, 0, 4.5, 0.5] },
    tio2: { name: 'Dielectric nano-antenna', formula: 'TiO2', colour: '#fbbf24', thickness: 180, kpar: 8, kperp: 8, sigma: 1e-8, roles: [1, 1, 0, 4.5, 0, 1, 0] },
    gst: { name: 'Phase-change memory film', formula: 'GST', colour: '#f472b6', thickness: 250, kpar: 0.3, kperp: 0.3, sigma: 100, roles: [0.5, 1, 2.5, 5, 0, 1, 5] },
    aluminium: { name: 'Reflective backplane', formula: 'Al', colour: '#cbd5e1', thickness: 200, kpar: 235, kperp: 235, sigma: 3.5e7, roles: [2.5, 4.5, 5, 4, 0.5, 0, 0] },
    moo3: { name: 'Directional polariton layer', formula: 'alpha-MoO3', colour: '#fb7185', thickness: 120, kpar: 10, kperp: 2, sigma: 1e-8, roles: [1, 2, 0.5, 5, 0, 3, 0] },
    fe16n2: { name: 'Ordered iron nitride flux guide', formula: 'Fe16N2', colour: '#fb7185', thickness: 300, kpar: 10, kperp: 8, sigma: 1e6, roles: [3, 1.5, 3, 1, 5, 2, 1] },
    fese: { name: 'Iron selenide quantum layer', formula: 'FeSe', colour: '#f472b6', thickness: 0.7, kpar: 20, kperp: 3, sigma: 1e5, roles: [0.5, 1, 2.5, 1, 2, 5, 1] },
    sto: { name: 'Interface oxide', formula: 'SrTiO3', colour: '#a78bfa', thickness: 5, kpar: 12, kperp: 12, sigma: 1e-8, roles: [2, 2, 0, 2, 0, 4.5, 0] },
    rebco: { name: 'Steady-current superconducting layer', formula: 'REBCO normal-state proxy', colour: '#34d399', thickness: 600, kpar: 8, kperp: 2, sigma: 1e6, roles: [2.5, 1.5, 5, 0, 4.5, 5, 0] },
    mgb2: { name: 'Superconducting current layer', formula: 'MgB2', colour: '#67e8f9', thickness: 300, kpar: 60, kperp: 20, sigma: 1e7, roles: [2, 3, 5, 0, 3.5, 5, 0] },
    fetese: { name: 'Topological vortex research layer', formula: 'FeTeSe', colour: '#f472b6', thickness: 10, kpar: 20, kperp: 3, sigma: 1e5, roles: [0.5, 1, 2.5, 2, 3.5, 5, 2] },
    silicon: { name: 'Low-spin resonator base', formula: 'Si', colour: '#fde047', thickness: 300, kpar: 148, kperp: 148, sigma: 1e-6, roles: [3, 3.5, 0.5, 3, 0, 4, 0] },
    ferrite: { name: 'Magnetic RF absorber', formula: 'ferrite + MXene', colour: '#60a5fa', thickness: 500, kpar: 5, kperp: 5, sigma: 1e-3, roles: [2, 1, 2, 2, 4.5, 0, 1] },
    zirconia: { name: 'Graded ceramic barrier', formula: 'ZrO2-SiO2', colour: '#cbd5e1', thickness: 1000, kpar: 2, kperp: 2, sigma: 1e-10, roles: [4, 4, 0, 1, 0, 0, 0] }
  };

  var presets = {
    hull: ['borophene', 'graphene', 'hbn', 'mxene', 'max', 'rhea'],
    moire: ['graphene', 'hbn', 'wse2', 'mose2', 'hbn', 'graphene'],
    thermal: ['tio2', 'gst', 'aluminium', 'graphene'],
    flux: ['rhea', 'hbn', 'fe16n2', 'rebco', 'mgb2', 'fetese', 'silicon', 'aluminium']
  };

  var rules = [
    { keys: ['graphene', 'hbn'], adjacent: true, bonus: { heat: 0.5, electrical: 0.4, quantum: 0.5 }, title: 'Graphene + h-BN', copy: 'A clean heat and charge path sits beside an atomically flat electrical separator.' },
    { keys: ['wse2', 'mose2'], adjacent: true, dynamic: 'moire', bonus: { optical: 0.8, quantum: 0.9 }, title: 'WSe2 + MoSe2', copy: 'Lattice mismatch and twist create a moiré potential for minibands and confined excitons.' },
    { keys: ['tio2', 'gst', 'aluminium'], sequence: true, bonus: { optical: 0.8, memory: 0.9, heat: 0.3 }, title: 'TiO2 > GST > aluminium', copy: 'The directed resonator, phase-change spacer and reflective backplane form the thermal-emission cavity.' },
    { keys: ['fese', 'sto'], adjacent: true, bonus: { quantum: 1, electrical: 0.4 }, title: 'FeSe + SrTiO3', copy: 'The interface supplies coupling and charge conditions absent from either isolated layer.' },
    { keys: ['moo3', 'graphene'], adjacent: true, bonus: { optical: 0.8, electrical: 0.4 }, title: 'alpha-MoO3 + graphene', copy: 'A conductive control sheet can tune directional, deeply confined infrared polaritons.' },
    { keys: ['max', 'mxene'], adjacent: true, bonus: { mechanical: 0.6, heat: 0.5, electrical: 0.5 }, title: 'MAX + MXene', copy: 'Layered structure grades a ceramic load path into a surface-active conductive sheet.' },
    { keys: ['rhea', 'max'], adjacent: true, bonus: { mechanical: 0.7, heat: 0.4 }, title: 'RHEA + MAX', copy: 'A refractory load shell meets a thermal-shock-tolerant ceramic-metal transition.' },
    { keys: ['fe16n2', 'mgb2'], adjacent: false, bonus: { magnetic: 0.9, quantum: 0.7, electrical: 0.5 }, title: 'Fe16N2 + MgB2', copy: 'Separated flux guidance and high-current paths divide magnetic geometry from current transport.' },
    { keys: ['borophene', 'graphene', 'hbn'], adjacent: false, bonus: { mechanical: 0.6, heat: 0.6, electrical: 0.5 }, title: 'Borophene + graphene + h-BN', copy: 'Directional stiffness, heat spreading and dielectric isolation occupy separate atomic sheets.' },
    { keys: ['ferrite', 'mxene'], adjacent: true, bonus: { magnetic: 0.6, electrical: 0.4 }, title: 'Ferrite + MXene', copy: 'Magnetic loss and sheet current work together across an RF impedance gradient.' }
  ];

  var stack = [];
  var nextId = 1;

  function makeLayer(key) {
    return {
      id: nextId++,
      key: key,
      thickness: layers[key].thickness,
      connected: layers[key].sigma >= 1e5 && layers[key].roles[2] >= 4
    };
  }

  function setPresetState(active) {
    presetButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-stack-preset') === active ? 'true' : 'false');
    });
  }

  function loadPreset(name) {
    stack = presets[name].map(makeLayer);
    setPresetState(name);
    renderStack();
    stackStatus.textContent = presetButtons.filter(function (button) { return button.getAttribute('data-stack-preset') === name; })[0].textContent + ' preset loaded, outside to inside.';
  }

  function stackKeys() {
    return stack.map(function (item) { return item.key; });
  }

  function hasAdjacentPair(a, b) {
    var keys = stackKeys();
    for (var i = 0; i < keys.length - 1; i += 1) {
      if ((keys[i] === a && keys[i + 1] === b) || (keys[i] === b && keys[i + 1] === a)) return true;
    }
    return false;
  }

  function hasDirectedSequence(sequence) {
    var keys = stackKeys();
    for (var start = 0; start <= keys.length - sequence.length; start += 1) {
      var match = sequence.every(function (key, offset) { return keys[start + offset] === key; });
      if (match) return true;
    }
    return false;
  }

  function moireStackState() {
    var angle = Number(document.documentElement.getAttribute('data-moire-twist')) || 1.1;
    var theta = angle * Math.PI / 180;
    var a1 = 0.328;
    var a2 = 0.329;
    var mean = (a1 + a2) / 2;
    var mismatch = (a2 - a1) / mean;
    var period = mean / Math.sqrt(mismatch * mismatch + theta * theta);
    return { angle: angle, period: period };
  }

  function activeRules() {
    var keys = stackKeys();
    return rules.filter(function (rule) {
      if (rule.sequence) return hasDirectedSequence(rule.keys);
      if (rule.adjacent) return hasAdjacentPair(rule.keys[0], rule.keys[1]);
      return rule.keys.every(function (key) { return keys.indexOf(key) >= 0; });
    }).map(function (rule) {
      if (rule.dynamic !== 'moire') return rule;
      var state = moireStackState();
      return {
        title: rule.title,
        copy: state.angle.toFixed(1) + '° twist gives an approximate ' + state.period.toFixed(1) + ' nm moiré period. The lattice control above updates this stack geometry; a future band solver maps each angle to measured optical or quantum response.',
        bonus: rule.bonus
      };
    });
  }

  function actionButton(action, index, label, text, disabled) {
    return '<button class="layer-action" type="button" data-layer-action="' + action + '" data-layer-index="' + index + '" aria-label="' + label + '"' + (disabled ? ' disabled' : '') + '>' + text + '</button>';
  }

  function renderLayerList() {
    stackList.innerHTML = stack.map(function (item, index) {
      var layer = layers[item.key];
      return '<li class="stack-layer" data-layer-id="' + item.id + '" style="--layer-colour:' + layer.colour + '">' +
        '<span class="layer-swatch" aria-hidden="true"></span>' +
        '<span class="layer-name">' + layer.name + '<small>' + layer.formula + '</small></span>' +
        '<label class="thickness-field"><input type="number" min="0.5" max="5000" step="0.5" value="' + item.thickness + '" data-thickness-index="' + index + '" aria-label="Thickness of ' + layer.name + '"><span>nm</span></label>' +
        '<label class="bus-field"><input type="checkbox" data-bus-index="' + index + '"' + (item.connected ? ' checked' : '') + ' aria-label="Connect ' + layer.name + ' to the model electrical bus"><span>Bus</span></label>' +
        '<span class="layer-actions">' +
          actionButton('up', index, 'Move ' + layer.name + ' towards the outside', '↑', index === 0) +
          actionButton('down', index, 'Move ' + layer.name + ' towards the inside', '↓', index === stack.length - 1) +
          actionButton('remove', index, 'Remove ' + layer.name, '×', false) +
        '</span></li>';
    }).join('');
  }

  function renderCrossSection() {
    if (!stack.length) {
      stackCrossSection.innerHTML = '<span class="model-copy">Add a layer to begin the cross-section.</span>';
      return;
    }
    stackCrossSection.innerHTML = stack.map(function (item) {
      var layer = layers[item.key];
      var height = Math.round(18 + Math.log(item.thickness + 1) / Math.LN10 * 7);
      return '<div class="stack-slice" style="--layer-colour:' + layer.colour + ';min-height:' + height + 'px">' + layer.formula + ' · ' + item.thickness + ' nm</div>';
    }).join('');
  }

  function formatConductance(value) {
    if (value >= 1000) return (value / 1000).toFixed(value >= 10000 ? 0 : 1) + ' k';
    if (value >= 1) return value.toFixed(1);
    if (value >= 0.001) return (value * 1000).toFixed(1) + ' m';
    if (value > 0) return value.toExponential(1);
    return '0';
  }

  function interfaceFactor(leftItem, rightItem) {
    var left = layers[leftItem.key];
    var right = layers[rightItem.key];
    var low = Math.max(0.05, Math.min(left.kperp, right.kperp));
    var high = Math.max(left.kperp, right.kperp);
    var thermalMismatch = Math.abs(Math.log(high / low)) * 0.32;
    var dimensionalMismatch = (leftItem.thickness <= 10) !== (rightItem.thickness <= 10) ? 0.55 : 0;
    var electricalMismatch = Math.abs(left.roles[2] - right.roles[2]) * 0.08;
    return Math.min(5, 1 + thermalMismatch + dimensionalMismatch + electricalMismatch);
  }

  function calculateMetrics() {
    if (!stack.length) return { kpar: 0, kperp: 0, sheet: 0 };
    var totalNm = 0;
    var parallelSum = 0;
    var perpendicularResistance = 0;
    var sheet = 0;
    stack.forEach(function (item) {
      var layer = layers[item.key];
      var thicknessM = item.thickness * 1e-9;
      totalNm += item.thickness;
      parallelSum += layer.kpar * item.thickness;
      perpendicularResistance += thicknessM / layer.kperp;
      if (item.connected) sheet += layer.sigma * thicknessM;
    });
    var boundaryResistance = 0;
    for (var i = 0; i < stack.length - 1; i += 1) {
      boundaryResistance += Number(interfaceResistance.value) * 1e-9 * interfaceFactor(stack[i], stack[i + 1]);
    }
    return {
      kpar: parallelSum / totalNm,
      kperp: totalNm * 1e-9 / (perpendicularResistance + boundaryResistance),
      sheet: sheet
    };
  }

  function calculateRoles(foundRules) {
    var scores = {};
    roles.forEach(function (role, roleIndex) {
      var values = stack.map(function (item) { return layers[item.key].roles[roleIndex]; }).sort(function (a, b) { return b - a; });
      var score = values.length ? values[0] : 0;
      for (var i = 1; i < values.length; i += 1) score += values[i] * 0.18;
      scores[role[0]] = score;
    });
    foundRules.forEach(function (rule) {
      Object.keys(rule.bonus).forEach(function (key) { scores[key] = (scores[key] || 0) + rule.bonus[key]; });
    });
    Object.keys(scores).forEach(function (key) { scores[key] = Math.min(5, scores[key]); });
    return scores;
  }

  function renderOutput() {
    var foundRules = activeRules();
    var metrics = calculateMetrics();
    var scores = calculateRoles(foundRules);
    var resistance = Number(interfaceResistance.value);
    interfaceValue.innerHTML = resistance + ' × 10<sup>-9</sup> m² K/W';
    parallelThermal.textContent = '≈ ' + metrics.kpar.toFixed(metrics.kpar >= 100 ? 0 : 1);
    perpendicularThermal.textContent = '≈ ' + metrics.kperp.toFixed(metrics.kperp >= 100 ? 0 : 1);
    sheetConductance.textContent = '≈ ' + formatConductance(metrics.sheet);
    roleMap.innerHTML = roles.map(function (role) {
      var value = scores[role[0]] || 0;
      return '<div class="role-row"><span class="role-label">' + role[1] + '</span><span class="role-track"><span class="role-fill" style="width:' + (value / 5 * 100).toFixed(1) + '%"></span></span><span class="role-value">' + value.toFixed(1) + '</span></div>';
    }).join('');
    var synergyMarkup = foundRules.length ? foundRules.map(function (rule) {
      return '<li><strong>' + rule.title + ':</strong> ' + rule.copy + '</li>';
    }).join('') : '<li><strong>Single-layer roles only.</strong> Add a listed neighbouring pair to activate a compounding rule.</li>';
    if (synergyList.innerHTML !== synergyMarkup) synergyList.innerHTML = synergyMarkup;
    renderCrossSection();
  }

  function renderStack() {
    renderLayerList();
    renderOutput();
  }

  presetButtons.forEach(function (button) {
    button.addEventListener('click', function () { loadPreset(button.getAttribute('data-stack-preset')); });
  });

  addLayer.addEventListener('click', function () {
    stack.push(makeLayer(layerSelect.value));
    setPresetState('');
    renderStack();
    stackStatus.textContent = layers[layerSelect.value].name + ' added to the inside of the stack.';
  });

  stackList.addEventListener('click', function (event) {
    var button = event.target.closest('[data-layer-action]');
    if (!button) return;
    var index = Number(button.getAttribute('data-layer-index'));
    var action = button.getAttribute('data-layer-action');
    var movedId = stack[index].id;
    var movedName = layers[stack[index].key].name;
    if (action === 'remove') stack.splice(index, 1);
    if (action === 'up' && index > 0) {
      var above = stack[index - 1];
      stack[index - 1] = stack[index];
      stack[index] = above;
    }
    if (action === 'down' && index < stack.length - 1) {
      var below = stack[index + 1];
      stack[index + 1] = stack[index];
      stack[index] = below;
    }
    setPresetState('');
    renderStack();
    if (action === 'remove') {
      stackStatus.textContent = movedName + ' removed from the stack.';
      addLayer.focus();
    } else {
      var newIndex = stack.map(function (item) { return item.id; }).indexOf(movedId);
      stackStatus.textContent = movedName + ' moved to position ' + (newIndex + 1) + ' of ' + stack.length + ', outside to inside.';
      var refocus = stackList.querySelector('[data-layer-id="' + movedId + '"] [data-layer-action="' + action + '"]');
      if (refocus) refocus.focus();
    }
  });

  stackList.addEventListener('input', function (event) {
    var field = event.target.closest('[data-thickness-index]');
    if (field) {
      var index = Number(field.getAttribute('data-thickness-index'));
      var value = Math.max(0.5, Math.min(5000, Number(field.value) || 0.5));
      stack[index].thickness = value;
      setPresetState('');
      renderOutput();
      return;
    }
    var bus = event.target.closest('[data-bus-index]');
    if (bus) {
      stack[Number(bus.getAttribute('data-bus-index'))].connected = bus.checked;
      setPresetState('');
      renderOutput();
    }
  });

  stackList.addEventListener('change', function (event) {
    var field = event.target.closest('[data-thickness-index]');
    if (!field) return;
    var index = Number(field.getAttribute('data-thickness-index'));
    var value = Math.max(0.5, Math.min(5000, Number(field.value) || 0.5));
    stack[index].thickness = value;
    field.value = value;
    renderOutput();
  });

  interfaceResistance.addEventListener('input', renderOutput);
  document.addEventListener('moirechange', renderOutput);
  loadPreset('hull');
})();

(function () {
  'use strict';

  var temperature = document.getElementById('surfaceTemperature');
  if (!temperature) return;

  var emissivity = document.getElementById('surfaceEmissivity');
  var temperatureValue = document.getElementById('temperatureValue');
  var emissivityValue = document.getElementById('emissivityValue');
  var thermalPhase = document.getElementById('thermalPhase');
  var radiatedPower = document.getElementById('radiatedPower');
  var blackbodyPower = document.getElementById('blackbodyPower');
  var apparentTemperature = document.getElementById('apparentTemperature');
  var selectedEmission = document.getElementById('selectedEmission');
  var selectedEmissionValue = document.getElementById('selectedEmissionValue');
  var phaseCanvas = document.getElementById('phaseCanvas');
  var phaseContext = phaseCanvas ? phaseCanvas.getContext('2d') : null;
  var stateButtons = Array.prototype.slice.call(document.querySelectorAll('[data-emissivity]'));
  var phase = 'Amorphous';
  var phaseFraction = 0;
  var sigma = 5.670374419e-8;

  function phaseNoise(index, axis) {
    var raw = Math.sin((index + 2) * 18.813 + axis * 37.719) * 19873.531;
    return (raw - Math.floor(raw)) * 2 - 1;
  }

  function drawPhaseNetwork() {
    if (!phaseContext) return;
    var rect = phaseCanvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = Math.max(280, Math.round(rect.width));
    var height = Math.max(160, Math.round(rect.height));
    phaseCanvas.width = Math.round(width * dpr);
    phaseCanvas.height = Math.round(height * dpr);
    phaseContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    phaseContext.fillStyle = '#070b15';
    phaseContext.fillRect(0, 0, width, height);

    var cols = 9;
    var rows = 5;
    var padX = 30;
    var padY = 42;
    var spanX = (width - padX * 2) / (cols - 1);
    var spanY = (height - padY - 28) / (rows - 1);
    var points = [];
    for (var row = 0; row < rows; row += 1) {
      for (var col = 0; col < cols; col += 1) {
        var index = row * cols + col;
        var stagger = row % 2 ? spanX * 0.18 : 0;
        var orderedX = padX + col * spanX + stagger;
        var orderedY = padY + row * spanY;
        var disorderScale = (1 - phaseFraction) * Math.min(12, spanX * 0.3);
        points.push({
          x: orderedX + phaseNoise(index, 0) * disorderScale,
          y: orderedY + phaseNoise(index, 1) * disorderScale,
          row: row,
          col: col,
          species: index % 5 === 0 ? 'Ge' : index % 3 === 0 ? 'Sb' : 'Te'
        });
      }
    }

    function pointAt(row, col) { return points[row * cols + col]; }
    function bond(a, b, strength) {
      phaseContext.strokeStyle = 'rgba(147,163,196,' + (0.12 + strength * 0.45).toFixed(3) + ')';
      phaseContext.lineWidth = 0.8 + strength * 1.1;
      phaseContext.beginPath();
      phaseContext.moveTo(a.x, a.y);
      phaseContext.lineTo(b.x, b.y);
      phaseContext.stroke();
    }

    for (var r = 0; r < rows; r += 1) {
      for (var c = 0; c < cols; c += 1) {
        var current = pointAt(r, c);
        if (c < cols - 1) {
          var horizontalGate = (phaseNoise(r * cols + c, 2) + 1) / 2;
          if (phaseFraction > horizontalGate * 0.55 || horizontalGate > 0.3) bond(current, pointAt(r, c + 1), 0.35 + phaseFraction * 0.65);
        }
        if (r < rows - 1) {
          var verticalGate = (phaseNoise(r * cols + c, 3) + 1) / 2;
          if (phaseFraction > verticalGate * 0.8 || verticalGate > 0.67) bond(current, pointAt(r + 1, c), 0.2 + phaseFraction * 0.8);
        }
      }
    }

    var colours = { Ge: '#67e8f9', Sb: '#a78bfa', Te: '#fbbf24' };
    points.forEach(function (point) {
      phaseContext.beginPath();
      phaseContext.arc(point.x, point.y, 4.2, 0, Math.PI * 2);
      phaseContext.fillStyle = colours[point.species];
      phaseContext.fill();
      phaseContext.strokeStyle = '#04060c';
      phaseContext.lineWidth = 1;
      phaseContext.stroke();
    });

    phaseContext.fillStyle = '#93a3c4';
    phaseContext.font = '600 10px JetBrains Mono, monospace';
    phaseContext.textAlign = 'left';
    phaseContext.fillText('SIMPLIFIED GST COORDINATION', 14, 19);
    phaseContext.fillStyle = '#fbbf24';
    phaseContext.textAlign = 'right';
    phaseContext.fillText(Math.round(phaseFraction * 100) + '% ordered phase fraction', width - 14, 19);
    phaseContext.textAlign = 'left';
    var legend = [{ name: 'Ge', colour: '#67e8f9' }, { name: 'Sb', colour: '#a78bfa' }, { name: 'Te', colour: '#fbbf24' }];
    legend.forEach(function (item, index) {
      var x = 16 + index * 42;
      phaseContext.beginPath();
      phaseContext.arc(x, 31, 3, 0, Math.PI * 2);
      phaseContext.fillStyle = item.colour;
      phaseContext.fill();
      phaseContext.fillStyle = '#93a3c4';
      phaseContext.fillText(item.name, x + 6, 34);
    });
    phaseContext.textAlign = 'left';
    phaseContext.fillStyle = '#93a3c4';
    phaseContext.fillText('lower coordination', 14, height - 10);
    phaseContext.textAlign = 'right';
    phaseContext.fillText('higher coordination and registry', width - 14, height - 10);
  }

  function setPressed(activeButton) {
    stateButtons.forEach(function (button) { button.setAttribute('aria-pressed', button === activeButton ? 'true' : 'false'); });
  }

  function renderThermal() {
    var temp = Number(temperature.value);
    var epsilon = Number(emissivity.value);
    var blackbody = sigma * Math.pow(temp, 4);
    var selected = epsilon * blackbody;
    var apparent = Math.pow(epsilon, 0.25) * temp;
    temperatureValue.textContent = Math.round(temp) + ' K (' + Math.round(temp - 273.15) + ' °C)';
    emissivityValue.textContent = epsilon.toFixed(2);
    thermalPhase.textContent = phase + ' state';
    radiatedPower.textContent = selected.toFixed(0) + ' W/m²';
    blackbodyPower.textContent = blackbody.toFixed(0) + ' W/m²';
    apparentTemperature.textContent = apparent.toFixed(0) + ' K (' + Math.round(apparent - 273.15) + ' °C)';
    selectedEmission.style.width = (epsilon * 100).toFixed(0) + '%';
    selectedEmissionValue.textContent = (epsilon * 100).toFixed(0) + '%';
    drawPhaseNetwork();
  }

  stateButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      phase = button.getAttribute('data-phase');
      phaseFraction = Number(button.getAttribute('data-fraction'));
      emissivity.value = button.getAttribute('data-emissivity');
      setPressed(button);
      renderThermal();
    });
  });

  temperature.addEventListener('input', renderThermal);
  emissivity.addEventListener('input', function () {
    phase = 'Selected';
    phaseFraction = Math.max(0, Math.min(1, (Number(emissivity.value) - 0.18) / (0.86 - 0.18)));
    setPressed(null);
    renderThermal();
  });
  window.addEventListener('resize', drawPhaseNetwork);
  renderThermal();
})();
