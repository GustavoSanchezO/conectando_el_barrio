'use client';

import { useState } from 'react';
import { getCategoryInfo, getCategoryList } from '@/lib/categories';

export default function BusinessPreview({ datos, onConfirm, onCancel }) {
  const [editData, setEditData] = useState({ ...datos });
  const [saving, setSaving] = useState(false);

  const categoryInfo = getCategoryInfo(editData.categoria);

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductoChange = (index, value) => {
    const newProductos = [...(editData.productos || [])];
    newProductos[index] = value;
    setEditData((prev) => ({ ...prev, productos: newProductos }));
  };

  const addProducto = () => {
    setEditData((prev) => ({
      ...prev,
      productos: [...(prev.productos || []), ''],
    }));
  };

  const removeProducto = (index) => {
    const newProductos = (editData.productos || []).filter((_, i) => i !== index);
    setEditData((prev) => ({ ...prev, productos: newProductos }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    // Clean up empty products
    const cleanData = {
      ...editData,
      productos: (editData.productos || []).filter((p) => p.trim() !== ''),
    };
    if (onConfirm) await onConfirm(cleanData);
    setSaving(false);
  };

  return (
    <div className="business-preview">
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
          <div
            className="business-card-icon"
            style={{ backgroundColor: `${categoryInfo.color}20`, fontSize: '1.8rem' }}
          >
            {categoryInfo.emoji}
          </div>
          <div>
            <h3 style={{ margin: 0 }}>Vista previa del negocio</h3>
            <p className="text-small" style={{ margin: 0 }}>Revisa y edita la información antes de confirmar</p>
          </div>
        </div>

        <div className="preview-field">
          <label>Nombre del negocio</label>
          <input
            className="form-input"
            value={editData.nombre || ''}
            onChange={(e) => handleChange('nombre', e.target.value)}
            placeholder="Nombre del negocio"
          />
        </div>

        <div className="preview-field">
          <label>Categoría</label>
          <select
            className="form-input"
            value={editData.categoria || 'Otro'}
            onChange={(e) => handleChange('categoria', e.target.value)}
          >
            {getCategoryList().map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="preview-field">
          <label>Descripción</label>
          <textarea
            className="form-input"
            value={editData.descripcion || ''}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            placeholder="Descripción del negocio"
            rows={3}
          />
        </div>

        <div className="preview-field">
          <label>Horario</label>
          <input
            className="form-input"
            value={editData.horario || ''}
            onChange={(e) => handleChange('horario', e.target.value)}
            placeholder="Ej: Lunes a Sábado, 9:00 AM - 6:00 PM"
          />
        </div>

        <div className="preview-field">
          <label>Dirección</label>
          <input
            className="form-input"
            value={editData.direccion || ''}
            onChange={(e) => handleChange('direccion', e.target.value)}
            placeholder="Dirección en Durango"
          />
        </div>

        <div className="preview-field">
          <label>Teléfono</label>
          <input
            className="form-input"
            value={editData.telefono || ''}
            onChange={(e) => handleChange('telefono', e.target.value)}
            placeholder="Número de teléfono"
          />
        </div>

        <div className="preview-field">
          <label>Productos / Servicios</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {(editData.productos || []).map((prod, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <input
                  className="form-input"
                  style={{ flex: 1 }}
                  value={prod}
                  onChange={(e) => handleProductoChange(i, e.target.value)}
                  placeholder={`Producto ${i + 1}`}
                />
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => removeProducto(i)}
                  style={{ color: 'var(--danger)' }}
                >
                  ✕
                </button>
              </div>
            ))}
            {(editData.productos || []).length < 5 && (
              <button className="btn btn-ghost btn-sm" onClick={addProducto}>
                + Agregar producto
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="preview-actions">
        <button
          className="btn btn-outline"
          onClick={onCancel}
          style={{ flex: 1 }}
        >
          ← Grabar de nuevo
        </button>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleSubmit}
          disabled={saving || !editData.nombre}
          style={{ flex: 1 }}
        >
          {saving ? (
            <>
              <span className="loading-spinner" style={{ width: 20, height: 20 }}></span>
              Guardando...
            </>
          ) : (
            '✓ Confirmar y Registrar'
          )}
        </button>
      </div>
    </div>
  );
}
