import React, { useState, useEffect } from 'react';
import { Calculator, Clock, Package, TrendingUp, DollarSign, Plus, Trash2, List, Circle, Square, RectangleHorizontal, Save, FolderOpen, FileText } from 'lucide-react';

export default function CalculadoraGomaEva() {
  const [piezas, setPiezas] = useState([]);
  const [nuevaPieza, setNuevaPieza] = useState({
    nombre: '',
    forma: 'circulo',
    diametro: 0,
    lado: 0, // Para cuadrado, triángulo, pentágono, hexágono, octágono
    ancho: 0,
    largo: 0,
    cm2Unitario: 0,
    cantidad: 1
  });
  
  const [materiales, setMateriales] = useState({
    cm2Plancha: 2400,
    costoPorPlancha: 0,
    otrosMateriales: 0
  });
  
  const [tiempo, setTiempo] = useState({
    horas: 0,
    costoPorHora: 0
  });
  
  const [costosGenerales, setCostosGenerales] = useState(0);
  
  const [itemsCostosGenerales, setItemsCostosGenerales] = useState([]);
  const [nuevoItemCosto, setNuevoItemCosto] = useState({
    nombre: '',
    cantidad: 1,
    precio: 0
  });
  
  const [margenes, setMargenes] = useState({
    mayorista: 30,
    minorista: 50
  });

  // Estados para guardar/cargar trabajos
  const [nombreTrabajo, setNombreTrabajo] = useState('');
  const [trabajosGuardados, setTrabajosGuardados] = useState([]);
  const [mostrarGuardados, setMostrarGuardados] = useState(false);

  // Cargar trabajos guardados al iniciar
  useEffect(() => {
    try {
      const trabajos = JSON.parse(localStorage.getItem('trabajosGomaEva') || '[]');
      setTrabajosGuardados(trabajos);
    } catch (error) {
      console.error('Error cargando trabajos:', error);
      setTrabajosGuardados([]);
    }
  }, []);

  // Guardar trabajo actual
  const guardarTrabajo = () => {
    if (!nombreTrabajo.trim()) {
      window.alert('Por favor ingresa un nombre para el trabajo');
      return;
    }

    const trabajo = {
      id: Date.now(),
      nombre: nombreTrabajo,
      fecha: new Date().toLocaleString('es-AR'),
      piezas,
      materiales,
      tiempo,
      costosGenerales,
      itemsCostosGenerales,
      margenes
    };

    try {
      const trabajos = JSON.parse(localStorage.getItem('trabajosGomaEva') || '[]');
      trabajos.push(trabajo);
      localStorage.setItem('trabajosGomaEva', JSON.stringify(trabajos));
      setTrabajosGuardados(trabajos);
      setNombreTrabajo('');
      window.alert('✅ Trabajo guardado exitosamente!');
    } catch (error) {
      console.error('Error guardando trabajo:', error);
      window.alert('❌ Error al guardar el trabajo');
    }
  };

  // Cargar trabajo guardado
  const cargarTrabajo = (trabajo) => {
    setPiezas(trabajo.piezas || []);
    setMateriales(trabajo.materiales || { cm2Plancha: 2400, costoPorPlancha: 0, otrosMateriales: 0 });
    setTiempo(trabajo.tiempo || { horas: 0, costoPorHora: 0 });
    setCostosGenerales(trabajo.costosGenerales || 0);
    setItemsCostosGenerales(trabajo.itemsCostosGenerales || []);
    setMargenes(trabajo.margenes || { mayorista: 30, minorista: 50 });
    setMostrarGuardados(false);
    window.alert('✅ Trabajo cargado: ' + trabajo.nombre);
  };

  // Eliminar trabajo guardado
  const eliminarTrabajo = (id) => {
    const confirmacion = window.confirm('¿Estás segura de eliminar este trabajo?');
    if (confirmacion) {
      try {
        const trabajos = trabajosGuardados.filter(t => t.id !== id);
        localStorage.setItem('trabajosGomaEva', JSON.stringify(trabajos));
        setTrabajosGuardados(trabajos);
      } catch (error) {
        console.error('Error eliminando trabajo:', error);
        window.alert('❌ Error al eliminar el trabajo');
      }
    }
  };

  // Limpiar todo
  const limpiarTodo = () => {
    const confirmacion = window.confirm('¿Estás segura de limpiar todos los datos?');
    if (confirmacion) {
      setPiezas([]);
      setMateriales({ cm2Plancha: 2400, costoPorPlancha: 0, otrosMateriales: 0 });
      setTiempo({ horas: 0, costoPorHora: 0 });
      setCostosGenerales(0);
      setItemsCostosGenerales([]);
      setMargenes({ mayorista: 30, minorista: 50 });
      setNombreTrabajo('');
    }
  };

  // Calcular cm² según la forma
  const calcularCm2 = (pieza) => {
    switch(pieza.forma) {
      case 'circulo':
        const radio = pieza.diametro / 2;
        return Math.PI * radio * radio;
      case 'cuadrado':
        return pieza.lado * pieza.lado;
      case 'triangulo':
        // Triángulo equilátero: (lado² × √3) / 4
        return (pieza.lado * pieza.lado * Math.sqrt(3)) / 4;
      case 'pentagono':
        // Pentágono regular: lado² × 1.720477
        return pieza.lado * pieza.lado * 1.720477;
      case 'hexagono':
        // Hexágono regular: (3√3 × lado²) / 2
        return (3 * Math.sqrt(3) * pieza.lado * pieza.lado) / 2;
      case 'octagono':
        // Octágono regular: 2 × lado² × (1 + √2)
        return 2 * pieza.lado * pieza.lado * (1 + Math.sqrt(2));
      case 'rectangulo':
        return pieza.ancho * pieza.largo;
      case 'manual':
      default:
        return pieza.cm2Unitario;
    }
  };

  // Funciones para manejar piezas
  const agregarPieza = () => {
    const cm2Calculado = calcularCm2(nuevaPieza);
    if (nuevaPieza.nombre && cm2Calculado > 0 && nuevaPieza.cantidad > 0) {
      setPiezas([...piezas, { 
        ...nuevaPieza, 
        cm2Unitario: cm2Calculado,
        id: Date.now() 
      }]);
      setNuevaPieza({ 
        nombre: '', 
        forma: 'circulo',
        diametro: 0,
        lado: 0,
        ancho: 0,
        largo: 0,
        cm2Unitario: 0, 
        cantidad: 1 
      });
    }
  };

  const eliminarPieza = (id) => {
    setPiezas(piezas.filter(p => p.id !== id));
  };

  // Funciones para costos generales
  const agregarItemCosto = () => {
    if (nuevoItemCosto.nombre && nuevoItemCosto.cantidad > 0 && nuevoItemCosto.precio > 0) {
      setItemsCostosGenerales([...itemsCostosGenerales, { ...nuevoItemCosto, id: Date.now() }]);
      setNuevoItemCosto({ nombre: '', cantidad: 1, precio: 0 });
    }
  };

  const eliminarItemCosto = (id) => {
    setItemsCostosGenerales(itemsCostosGenerales.filter(item => item.id !== id));
  };

  // Cálculos
  const cm2TotalesUsados = piezas.reduce((total, pieza) => total + (pieza.cm2Unitario * pieza.cantidad), 0);
  const costoGomaEva = (cm2TotalesUsados / materiales.cm2Plancha) * materiales.costoPorPlancha;
  const costoMateriales = costoGomaEva + materiales.otrosMateriales;
  const costoTiempo = tiempo.horas * tiempo.costoPorHora;
  
  // Calcular costos generales desde items + monto manual
  const costosGeneralesItems = itemsCostosGenerales.reduce((total, item) => total + (item.cantidad * item.precio), 0);
  const costosGeneralesTotales = costosGeneralesItems + costosGenerales;
  
  const costoBase = costoMateriales + costoTiempo + costosGeneralesTotales;
  
  const precioMayorista = costoBase * (1 + margenes.mayorista / 100);
  const precioMinorista = costoBase * (1 + margenes.minorista / 100);
  
  const gananciaMayorista = precioMayorista - costoBase;
  const gananciaMinorista = precioMinorista - costoBase;

  // Cálculo por pieza individual
  const totalPiezas = piezas.reduce((sum, p) => sum + p.cantidad, 0);
  const costoPorPiezaBase = totalPiezas > 0 ? costoBase / totalPiezas : 0;
  const precioMayoristaPorPieza = costoPorPiezaBase * (1 + margenes.mayorista / 100);
  const precioMinoristaPorPieza = costoPorPiezaBase * (1 + margenes.minorista / 100);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ffeaa7 100%)',
      padding: '20px',
      fontFamily: '"Quicksand", "Comic Sans MS", cursive'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '30px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
        border: '4px solid #ff6b6b'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '15px',
            background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
            color: 'white',
            padding: '15px 40px',
            borderRadius: '50px',
            boxShadow: '0 10px 30px rgba(255, 107, 107, 0.3)',
            marginBottom: '20px'
          }}>
            <Calculator size={32} />
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '700' }}>
              Calculadora Goma Eva
            </h1>
          </div>
          <p style={{
            fontSize: '18px',
            color: '#666',
            margin: '10px 0 0 0',
            fontWeight: '500'
          }}>
            Calcula tus costos y precios por pieza
          </p>
        </div>

        {/* Sección Guardar/Cargar Trabajos */}
        <div style={{
          background: 'linear-gradient(135deg, #e8eaf6, #c5cae9)',
          padding: '20px',
          borderRadius: '20px',
          marginBottom: '25px',
          border: '2px solid #9fa8da'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {/* Guardar trabajo */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#555',
                fontWeight: '600',
                fontSize: '14px'
              }}>
                Nombre del trabajo
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={nombreTrabajo}
                  onChange={(e) => setNombreTrabajo(e.target.value)}
                  placeholder="Ej: Souvenirs Cumple Ana..."
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid #c5cae9',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.border = '2px solid #5c6bc0'}
                  onBlur={(e) => e.target.style.border = '2px solid #c5cae9'}
                />
                <button
                  onClick={guardarTrabajo}
                  style={{
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #5c6bc0, #3f51b5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(92, 107, 192, 0.3)',
                    transition: 'transform 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  <Save size={18} />
                  Guardar
                </button>
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <button
                onClick={() => setMostrarGuardados(!mostrarGuardados)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: mostrarGuardados ? 'linear-gradient(135deg, #7e57c2, #673ab7)' : 'linear-gradient(135deg, #26a69a, #00897b)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(38, 166, 154, 0.3)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                <FolderOpen size={18} />
                {mostrarGuardados ? 'Ocultar' : `Ver Guardados (${trabajosGuardados.length})`}
              </button>

              <button
                onClick={limpiarTodo}
                style={{
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #ef5350, #e53935)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(239, 83, 80, 0.3)',
                  transition: 'transform 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                <Trash2 size={18} />
                Limpiar
              </button>
            </div>
          </div>

          {/* Lista de trabajos guardados */}
          {mostrarGuardados && trabajosGuardados.length > 0 && (
            <div style={{
              marginTop: '20px',
              padding: '20px',
              background: 'white',
              borderRadius: '15px',
              border: '2px solid #c5cae9',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              <div style={{
                fontWeight: '700',
                fontSize: '16px',
                color: '#5c6bc0',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FileText size={20} />
                Trabajos Guardados
              </div>

              {trabajosGuardados.map((trabajo) => (
                <div
                  key={trabajo.id}
                  style={{
                    padding: '15px',
                    background: '#f5f5f5',
                    borderRadius: '10px',
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', color: '#333', fontSize: '15px', marginBottom: '4px' }}>
                      {trabajo.nombre}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      📅 {trabajo.fecha} • {trabajo.piezas.reduce((sum, p) => sum + p.cantidad, 0)} piezas
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => cargarTrabajo(trabajo)}
                      style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #66bb6a, #4caf50)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                        transition: 'transform 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      Cargar
                    </button>
                    <button
                      onClick={() => eliminarTrabajo(trabajo.id)}
                      style={{
                        padding: '8px',
                        background: '#ffebee',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: '#ef5350',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#ffcdd2'}
                      onMouseOut={(e) => e.target.style.background = '#ffebee'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {mostrarGuardados && trabajosGuardados.length === 0 && (
            <div style={{
              marginTop: '20px',
              padding: '30px',
              background: 'white',
              borderRadius: '15px',
              border: '2px dashed #c5cae9',
              textAlign: 'center',
              color: '#999'
            }}>
              No hay trabajos guardados aún. ¡Guarda tu primer trabajo!
            </div>
          )}
        </div>

        {/* Sección Agregar Piezas */}
        <div style={{
          background: 'linear-gradient(135deg, #fff5f5, #ffe8e8)',
          padding: '25px',
          borderRadius: '20px',
          marginBottom: '25px',
          border: '2px solid #ffcccc'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <Package size={24} color="#ff6b6b" />
            <h2 style={{
              margin: 0,
              fontSize: '24px',
              color: '#ff6b6b',
              fontWeight: '700'
            }}>
              Piezas del Trabajo
            </h2>
          </div>

          {/* Formulario para agregar pieza */}
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '15px',
            marginBottom: '20px',
            border: '2px solid #ffe0e0'
          }}>
            {/* Nombre y Forma */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#555',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  Nombre de la pieza
                </label>
                <input
                  type="text"
                  value={nuevaPieza.nombre}
                  onChange={(e) => setNuevaPieza({...nuevaPieza, nombre: e.target.value})}
                  placeholder="Ej: Cara de muñeco, Flor grande..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid #ffd7d7',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.border = '2px solid #ff6b6b'}
                  onBlur={(e) => e.target.style.border = '2px solid #ffd7d7'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#555',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  Forma
                </label>
                <select
                  value={nuevaPieza.forma}
                  onChange={(e) => setNuevaPieza({...nuevaPieza, forma: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid #ffd7d7',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.border = '2px solid #ff6b6b'}
                  onBlur={(e) => e.target.style.border = '2px solid #ffd7d7'}
                >
                  <option value="circulo">⭕ Círculo</option>
                  <option value="triangulo">🔺 Triángulo</option>
                  <option value="cuadrado">⬜ Cuadrado</option>
                  <option value="pentagono">⬟ Pentágono</option>
                  <option value="hexagono">⬡ Hexágono</option>
                  <option value="octagono">⯃ Octágono</option>
                  <option value="rectangulo">▬ Rectángulo</option>
                  <option value="manual">✏️ Manual (cm²)</option>
                </select>
              </div>
            </div>

            {/* Campos según la forma */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '15px' }}>
              {nuevaPieza.forma === 'circulo' && (
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#555',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    Diámetro (cm)
                  </label>
                  <input
                    type="number"
                    value={nuevaPieza.diametro}
                    onChange={(e) => setNuevaPieza({...nuevaPieza, diametro: parseFloat(e.target.value) || 0})}
                    placeholder="10"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '2px solid #ffd7d7',
                      fontSize: '15px',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.border = '2px solid #ff6b6b'}
                    onBlur={(e) => e.target.style.border = '2px solid #ffd7d7'}
                  />
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                    {nuevaPieza.diametro > 0 && `≈ ${calcularCm2(nuevaPieza).toFixed(1)} cm²`}
                  </div>
                </div>
              )}

              {(nuevaPieza.forma === 'cuadrado' || nuevaPieza.forma === 'triangulo' || 
                nuevaPieza.forma === 'pentagono' || nuevaPieza.forma === 'hexagono' || 
                nuevaPieza.forma === 'octagono') && (
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#555',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    Lado (cm)
                  </label>
                  <input
                    type="number"
                    value={nuevaPieza.lado}
                    onChange={(e) => setNuevaPieza({...nuevaPieza, lado: parseFloat(e.target.value) || 0})}
                    placeholder="15"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '2px solid #ffd7d7',
                      fontSize: '15px',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.border = '2px solid #ff6b6b'}
                    onBlur={(e) => e.target.style.border = '2px solid #ffd7d7'}
                  />
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                    {nuevaPieza.lado > 0 && `≈ ${calcularCm2(nuevaPieza).toFixed(1)} cm²`}
                  </div>
                </div>
              )}

              {nuevaPieza.forma === 'rectangulo' && (
                <>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#555',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      Ancho (cm)
                    </label>
                    <input
                      type="number"
                      value={nuevaPieza.ancho}
                      onChange={(e) => setNuevaPieza({...nuevaPieza, ancho: parseFloat(e.target.value) || 0})}
                      placeholder="20"
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '2px solid #ffd7d7',
                        fontSize: '15px',
                        fontFamily: 'inherit',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.border = '2px solid #ff6b6b'}
                      onBlur={(e) => e.target.style.border = '2px solid #ffd7d7'}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#555',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      Largo (cm)
                    </label>
                    <input
                      type="number"
                      value={nuevaPieza.largo}
                      onChange={(e) => setNuevaPieza({...nuevaPieza, largo: parseFloat(e.target.value) || 0})}
                      placeholder="30"
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '2px solid #ffd7d7',
                        fontSize: '15px',
                        fontFamily: 'inherit',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.border = '2px solid #ff6b6b'}
                      onBlur={(e) => e.target.style.border = '2px solid #ffd7d7'}
                    />
                  </div>
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '30px' }}>
                    {nuevaPieza.ancho > 0 && nuevaPieza.largo > 0 && `= ${calcularCm2(nuevaPieza).toFixed(1)} cm²`}
                  </div>
                </>
              )}

              {nuevaPieza.forma === 'manual' && (
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#555',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    cm² por unidad
                  </label>
                  <input
                    type="number"
                    value={nuevaPieza.cm2Unitario}
                    onChange={(e) => setNuevaPieza({...nuevaPieza, cm2Unitario: parseFloat(e.target.value) || 0})}
                    placeholder="100"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '2px solid #ffd7d7',
                      fontSize: '15px',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.border = '2px solid #ff6b6b'}
                    onBlur={(e) => e.target.style.border = '2px solid #ffd7d7'}
                  />
                </div>
              )}

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#555',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  Cantidad
                </label>
                <input
                  type="number"
                  value={nuevaPieza.cantidad}
                  onChange={(e) => setNuevaPieza({...nuevaPieza, cantidad: parseInt(e.target.value) || 1})}
                  min="1"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid #ffd7d7',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.border = '2px solid #ff6b6b'}
                  onBlur={(e) => e.target.style.border = '2px solid #ffd7d7'}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  onClick={agregarPieza}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  <Plus size={18} />
                  Agregar
                </button>
              </div>
            </div>
          </div>

          {/* Lista de piezas agregadas */}
          {piezas.length > 0 && (
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '15px',
              border: '2px solid #ffe0e0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '15px',
                color: '#ff6b6b',
                fontWeight: '700',
                fontSize: '16px'
              }}>
                <List size={20} />
                Piezas agregadas ({piezas.length} tipos)
              </div>

              {piezas.map((pieza) => {
                const cm2Totales = pieza.cm2Unitario * pieza.cantidad;
                const costoMaterialUnitario = (pieza.cm2Unitario / materiales.cm2Plancha) * materiales.costoPorPlancha;
                const costoMaterialTotal = costoMaterialUnitario * pieza.cantidad;
                
                return (
                  <div
                    key={pieza.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1.5fr auto',
                      gap: '15px',
                      padding: '15px',
                      background: '#fef5f5',
                      borderRadius: '10px',
                      marginBottom: '10px',
                      alignItems: 'center',
                      border: '1px solid #ffe0e0'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', color: '#333', fontSize: '15px', marginBottom: '3px' }}>
                        {pieza.nombre}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        {pieza.forma === 'circulo' && `⭕ Ø${pieza.diametro}cm`}
                        {pieza.forma === 'triangulo' && `🔺 Lado ${pieza.lado}cm`}
                        {pieza.forma === 'cuadrado' && `⬜ ${pieza.lado}×${pieza.lado}cm`}
                        {pieza.forma === 'pentagono' && `⬟ Lado ${pieza.lado}cm`}
                        {pieza.forma === 'hexagono' && `⬡ Lado ${pieza.lado}cm`}
                        {pieza.forma === 'octagono' && `⯃ Lado ${pieza.lado}cm`}
                        {pieza.forma === 'rectangulo' && `▬ ${pieza.ancho}×${pieza.largo}cm`}
                        {pieza.forma === 'manual' && `✏️ Manual`}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '13px', color: '#888', marginBottom: '2px' }}>cm²/unidad</div>
                      <div style={{ fontWeight: '600', color: '#666' }}>{pieza.cm2Unitario.toFixed(1)}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '13px', color: '#888', marginBottom: '2px' }}>Cantidad</div>
                      <div style={{ fontWeight: '700', color: '#ff6b6b', fontSize: '16px' }}>
                        {pieza.cantidad}x
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '13px', color: '#888', marginBottom: '2px' }}>Costo Material</div>
                      <div style={{ fontWeight: '700', color: '#2e7d32', fontSize: '14px' }}>
                        ${costoMaterialUnitario.toFixed(2)} c/u
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                        Total: ${costoMaterialTotal.toFixed(2)}
                      </div>
                    </div>
                    <button
                      onClick={() => eliminarPieza(pieza.id)}
                      style={{
                        padding: '8px',
                        background: '#ffe0e0',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: '#ff6b6b',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#ffcccc'}
                      onMouseOut={(e) => e.target.style.background = '#ffe0e0'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}

              <div style={{
                marginTop: '15px',
                padding: '15px',
                background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
                borderRadius: '10px',
                color: 'white',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '14px', opacity: '0.9', marginBottom: '5px' }}>
                    Total de piezas
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>
                    {totalPiezas} unidades
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', opacity: '0.9', marginBottom: '5px' }}>
                    Total cm² usados
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>
                    {cm2TotalesUsados.toFixed(1)} cm²
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Configuración de plancha */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginTop: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#555',
                fontWeight: '600',
                fontSize: '15px'
              }}>
                Tamaño plancha (cm²)
              </label>
              <input
                type="number"
                value={materiales.cm2Plancha}
                onChange={(e) => setMateriales({...materiales, cm2Plancha: parseFloat(e.target.value) || 1})}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '2px solid #ffd7d7',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.border = '2px solid #ff6b6b'}
                onBlur={(e) => e.target.style.border = '2px solid #ffd7d7'}
              />
              <div style={{
                fontSize: '13px',
                color: '#888',
                marginTop: '5px',
                fontStyle: 'italic'
              }}>
                Estándar: 2400cm² (40×60cm)
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#555',
                fontWeight: '600',
                fontSize: '15px'
              }}>
                Costo por plancha ($)
              </label>
              <input
                type="number"
                value={materiales.costoPorPlancha}
                onChange={(e) => setMateriales({...materiales, costoPorPlancha: parseFloat(e.target.value) || 0})}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '2px solid #ffd7d7',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.border = '2px solid #ff6b6b'}
                onBlur={(e) => e.target.style.border = '2px solid #ffd7d7'}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#555',
                fontWeight: '600',
                fontSize: '15px'
              }}>
                Otros materiales ($)
              </label>
              <input
                type="number"
                value={materiales.otrosMateriales}
                onChange={(e) => setMateriales({...materiales, otrosMateriales: parseFloat(e.target.value) || 0})}
                placeholder="Pegamento, tijeras, decoraciones, etc."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '2px solid #ffd7d7',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.border = '2px solid #ff6b6b'}
                onBlur={(e) => e.target.style.border = '2px solid #ffd7d7'}
              />
            </div>
          </div>

          <div style={{
            marginTop: '15px',
            padding: '15px',
            background: 'white',
            borderRadius: '10px',
            border: '1px solid #ffd7d7'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              fontSize: '14px',
              color: '#666',
              marginBottom: '10px'
            }}>
              <div>
                <span style={{ fontWeight: '600' }}>Goma eva usada:</span>
                <div style={{ color: '#ff6b6b', fontWeight: '600', fontSize: '15px' }}>
                  ${costoGomaEva.toFixed(2)}
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                  {materiales.cm2Plancha > 0 ? 
                    `(${((cm2TotalesUsados / materiales.cm2Plancha) * 100).toFixed(1)}% de la plancha)` 
                    : ''}
                </div>
              </div>
              <div>
                <span style={{ fontWeight: '600' }}>Otros materiales:</span>
                <div style={{ color: '#ff6b6b', fontWeight: '600', fontSize: '15px' }}>
                  ${materiales.otrosMateriales.toFixed(2)}
                </div>
              </div>
            </div>
            <div style={{
              borderTop: '2px solid #ffd7d7',
              paddingTop: '10px',
              fontSize: '16px',
              fontWeight: '700',
              color: '#ff6b6b',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Total Materiales:</span>
              <span style={{ fontSize: '20px' }}>${costoMateriales.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Sección Tiempo */}
        <div style={{
          background: 'linear-gradient(135deg, #f5f9ff, #e8f2ff)',
          padding: '25px',
          borderRadius: '20px',
          marginBottom: '25px',
          border: '2px solid #cce5ff'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <Clock size={24} color="#4a90e2" />
            <h2 style={{
              margin: 0,
              fontSize: '24px',
              color: '#4a90e2',
              fontWeight: '700'
            }}>
              Tiempo y Mano de Obra
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#555',
                fontWeight: '600',
                fontSize: '15px'
              }}>
                Horas de trabajo
              </label>
              <input
                type="number"
                step="0.5"
                value={tiempo.horas}
                onChange={(e) => setTiempo({...tiempo, horas: parseFloat(e.target.value) || 0})}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '2px solid #d7e8ff',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.border = '2px solid #4a90e2'}
                onBlur={(e) => e.target.style.border = '2px solid #d7e8ff'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#555',
                fontWeight: '600',
                fontSize: '15px'
              }}>
                Costo por hora ($)
              </label>
              <input
                type="number"
                value={tiempo.costoPorHora}
                onChange={(e) => setTiempo({...tiempo, costoPorHora: parseFloat(e.target.value) || 0})}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '2px solid #d7e8ff',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.border = '2px solid #4a90e2'}
                onBlur={(e) => e.target.style.border = '2px solid #d7e8ff'}
              />
            </div>
          </div>

          <div style={{
            marginTop: '15px',
            padding: '12px',
            background: 'white',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#4a90e2'
          }}>
            Total Mano de Obra: ${costoTiempo.toFixed(2)}
          </div>
        </div>

        {/* Costos Generales */}
        <div style={{
          background: 'linear-gradient(135deg, #fff9f5, #ffe8d5)',
          padding: '25px',
          borderRadius: '20px',
          marginBottom: '25px',
          border: '2px solid #ffd7b3'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <DollarSign size={24} color="#f39c12" />
            <h2 style={{
              margin: 0,
              fontSize: '24px',
              color: '#f39c12',
              fontWeight: '700'
            }}>
              Costos Generales
            </h2>
          </div>

          {/* Formulario para agregar item */}
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '15px',
            marginBottom: '20px',
            border: '2px solid #ffe8d5'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#555',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  Item / Material
                </label>
                <input
                  type="text"
                  value={nuevoItemCosto.nombre}
                  onChange={(e) => setNuevoItemCosto({...nuevoItemCosto, nombre: e.target.value})}
                  placeholder="Ej: Plasticola, Brillantina, Pintura..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid #ffd7b3',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.border = '2px solid #f39c12'}
                  onBlur={(e) => e.target.style.border = '2px solid #ffd7b3'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#555',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  Cantidad
                </label>
                <input
                  type="number"
                  value={nuevoItemCosto.cantidad}
                  onChange={(e) => setNuevoItemCosto({...nuevoItemCosto, cantidad: parseInt(e.target.value) || 1})}
                  min="1"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid #ffd7b3',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.border = '2px solid #f39c12'}
                  onBlur={(e) => e.target.style.border = '2px solid #ffd7b3'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#555',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  Precio ($)
                </label>
                <input
                  type="number"
                  value={nuevoItemCosto.precio}
                  onChange={(e) => setNuevoItemCosto({...nuevoItemCosto, precio: parseFloat(e.target.value) || 0})}
                  placeholder="600"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid #ffd7b3',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.border = '2px solid #f39c12'}
                  onBlur={(e) => e.target.style.border = '2px solid #ffd7b3'}
                />
              </div>

              <button
                onClick={agregarItemCosto}
                style={{
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #f39c12, #e67e22)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(243, 156, 18, 0.3)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                <Plus size={18} />
                Agregar
              </button>
            </div>
          </div>

          {/* Lista de items de costos generales */}
          {itemsCostosGenerales.length > 0 && (
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '15px',
              marginBottom: '15px',
              border: '2px solid #ffe8d5'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '15px',
                color: '#f39c12',
                fontWeight: '700',
                fontSize: '16px'
              }}>
                <List size={20} />
                Items agregados ({itemsCostosGenerales.length})
              </div>

              {itemsCostosGenerales.map((item) => {
                const subtotal = item.cantidad * item.precio;
                
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                      gap: '15px',
                      padding: '15px',
                      background: '#fffaf5',
                      borderRadius: '10px',
                      marginBottom: '10px',
                      alignItems: 'center',
                      border: '1px solid #ffe8d5'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', color: '#333', fontSize: '15px' }}>
                        {item.nombre}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '13px', color: '#888', marginBottom: '2px' }}>Cantidad</div>
                      <div style={{ fontWeight: '700', color: '#f39c12', fontSize: '16px' }}>
                        {item.cantidad}x
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '13px', color: '#888', marginBottom: '2px' }}>Precio</div>
                      <div style={{ fontWeight: '600', color: '#666' }}>${item.precio.toFixed(2)}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '13px', color: '#888', marginBottom: '2px' }}>Subtotal</div>
                      <div style={{ fontWeight: '700', color: '#2e7d32', fontSize: '16px' }}>
                        ${subtotal.toFixed(2)}
                      </div>
                    </div>
                    <button
                      onClick={() => eliminarItemCosto(item.id)}
                      style={{
                        padding: '8px',
                        background: '#ffe8d5',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: '#f39c12',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#ffd7b3'}
                      onMouseOut={(e) => e.target.style.background = '#ffe8d5'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Monto manual opcional */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#555',
              fontWeight: '600',
              fontSize: '15px'
            }}>
              Otros gastos fijos ($) <span style={{ fontSize: '13px', fontWeight: '400', color: '#888' }}>(opcional)</span>
            </label>
            <input
              type="number"
              value={costosGenerales}
              onChange={(e) => setCostosGenerales(parseFloat(e.target.value) || 0)}
              placeholder="Luz, empaque, envío, alquiler..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '2px solid #ffd7b3',
                fontSize: '16px',
                fontFamily: 'inherit',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.border = '2px solid #f39c12'}
              onBlur={(e) => e.target.style.border = '2px solid #ffd7b3'}
            />
          </div>

          {/* Total de costos generales */}
          <div style={{
            marginTop: '15px',
            padding: '15px',
            background: 'white',
            borderRadius: '10px',
            border: '1px solid #ffd7b3'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              fontSize: '14px',
              color: '#666',
              marginBottom: '10px'
            }}>
              <div>
                <span style={{ fontWeight: '600' }}>Items agregados:</span>
                <div style={{ color: '#f39c12', fontWeight: '600', fontSize: '15px' }}>
                  ${costosGeneralesItems.toFixed(2)}
                </div>
              </div>
              <div>
                <span style={{ fontWeight: '600' }}>Otros gastos:</span>
                <div style={{ color: '#f39c12', fontWeight: '600', fontSize: '15px' }}>
                  ${costosGenerales.toFixed(2)}
                </div>
              </div>
            </div>
            <div style={{
              borderTop: '2px solid #ffd7b3',
              paddingTop: '10px',
              fontSize: '16px',
              fontWeight: '700',
              color: '#f39c12',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Total Costos Generales:</span>
              <span style={{ fontSize: '20px' }}>${costosGeneralesTotales.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Márgenes de Ganancia */}
        <div style={{
          background: 'linear-gradient(135deg, #f5fff5, #e8ffe8)',
          padding: '25px',
          borderRadius: '20px',
          marginBottom: '30px',
          border: '2px solid #ccffcc'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <TrendingUp size={24} color="#27ae60" />
            <h2 style={{
              margin: 0,
              fontSize: '24px',
              color: '#27ae60',
              fontWeight: '700'
            }}>
              Márgenes de Ganancia
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#555',
                fontWeight: '600',
                fontSize: '15px'
              }}>
                Margen Mayorista (%)
              </label>
              <input
                type="number"
                value={margenes.mayorista}
                onChange={(e) => setMargenes({...margenes, mayorista: parseFloat(e.target.value) || 0})}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '2px solid #d7ffd7',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.border = '2px solid #27ae60'}
                onBlur={(e) => e.target.style.border = '2px solid #d7ffd7'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#555',
                fontWeight: '600',
                fontSize: '15px'
              }}>
                Margen Minorista (%)
              </label>
              <input
                type="number"
                value={margenes.minorista}
                onChange={(e) => setMargenes({...margenes, minorista: parseFloat(e.target.value) || 0})}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '2px solid #d7ffd7',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.border = '2px solid #27ae60'}
                onBlur={(e) => e.target.style.border = '2px solid #d7ffd7'}
              />
            </div>
          </div>
        </div>

        {/* Resultados - PRECIO POR PIEZA */}
        {piezas.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
            padding: '25px',
            borderRadius: '20px',
            marginBottom: '20px',
            border: '2px solid #a5d6a7'
          }}>
            <h2 style={{
              margin: '0 0 20px 0',
              fontSize: '24px',
              textAlign: 'center',
              fontWeight: '700',
              color: '#2e7d32'
            }}>
              💰 Precio por Pieza Individual
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '15px',
                border: '2px solid #a5d6a7'
              }}>
                <div style={{ fontSize: '14px', marginBottom: '8px', color: '#666', fontWeight: '600' }}>
                  Precio Mayorista por pieza
                </div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#2e7d32', marginBottom: '8px' }}>
                  ${precioMayoristaPorPieza.toFixed(2)}
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  Margen: {margenes.mayorista}%
                </div>
              </div>

              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '15px',
                border: '2px solid #a5d6a7'
              }}>
                <div style={{ fontSize: '14px', marginBottom: '8px', color: '#666', fontWeight: '600' }}>
                  Precio Minorista por pieza
                </div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#2e7d32', marginBottom: '8px' }}>
                  ${precioMinoristaPorPieza.toFixed(2)}
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  Margen: {margenes.minorista}%
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '15px',
              padding: '15px',
              background: 'rgba(46, 125, 50, 0.1)',
              borderRadius: '10px',
              fontSize: '13px',
              color: '#2e7d32',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              Estos precios son por unidad. Total de piezas: {totalPiezas}
            </div>
          </div>
        )}

        {/* Resultados - PRECIO TOTAL */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px',
          borderRadius: '20px',
          color: 'white',
          boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)'
        }}>
          <h2 style={{
            margin: '0 0 25px 0',
            fontSize: '28px',
            textAlign: 'center',
            fontWeight: '700',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            Resultados Totales del Trabajo
          </h2>

          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '20px',
            borderRadius: '15px',
            marginBottom: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '18px', marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Costo Base Total:</span>
                <span style={{ fontWeight: '700' }}>${costoBase.toFixed(2)}</span>
              </div>
              <div style={{ 
                height: '1px', 
                background: 'rgba(255, 255, 255, 0.3)', 
                margin: '10px 0' 
              }} />
              <div style={{ fontSize: '14px', opacity: '0.9', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>• Materiales:</span>
                  <span>${costoMateriales.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>• Mano de obra:</span>
                  <span>${costoTiempo.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>• Gastos generales:</span>
                  <span>${costosGeneralesTotales.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '20px',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{ fontSize: '14px', marginBottom: '8px', opacity: '0.9' }}>
                Precio Total Mayorista
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
                ${precioMayorista.toFixed(2)}
              </div>
              <div style={{ fontSize: '14px', opacity: '0.9' }}>
                Ganancia: ${gananciaMayorista.toFixed(2)} ({margenes.mayorista}%)
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '20px',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{ fontSize: '14px', marginBottom: '8px', opacity: '0.9' }}>
                Precio Total Minorista
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
                ${precioMinorista.toFixed(2)}
              </div>
              <div style={{ fontSize: '14px', opacity: '0.9' }}>
                Ganancia: ${gananciaMinorista.toFixed(2)} ({margenes.minorista}%)
              </div>
            </div>
          </div>
        </div>

        {/* Explicación */}
        <div style={{
          marginTop: '30px',
          padding: '25px',
          background: '#fffbea',
          borderRadius: '15px',
          border: '2px dashed #ffd93d',
          fontSize: '15px',
          lineHeight: '1.8'
        }}>
          <h3 style={{
            margin: '0 0 15px 0',
            color: '#f39c12',
            fontSize: '20px',
            fontWeight: '700'
          }}>
            💡 ¿Cómo funciona el cálculo?
          </h3>
          <ol style={{ margin: 0, paddingLeft: '20px' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>Agregas piezas:</strong> Elige forma (círculo, cuadrado, rectángulo) o ingresa cm² manual
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Agregas costos generales:</strong> Puedes agregar items individuales (plasticola, brillantina, etc.) o ingresar un monto fijo
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Costo por pieza:</strong> Se calcula automáticamente según el tamaño y costo de la plancha
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Precio Individual:</strong> Divide todos los costos entre el total de piezas
            </li>
            <li>
              <strong>Precio Total:</strong> Suma todos los costos y aplica el margen de ganancia
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}