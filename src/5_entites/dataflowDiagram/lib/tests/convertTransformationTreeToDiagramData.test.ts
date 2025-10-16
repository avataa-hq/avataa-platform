import { describe, it, expect } from 'vitest';

import { PipelineStructure } from '6_shared/api/dataview/types';

import { convertPipelineStructureToDiagramData } from '../convertPipelineStructureToDiagramData';

describe('convertTransformationTreeToDiagramData()', () => {
  it('converts relations to links', () => {
    expect.hasAssertions();
    const input: PipelineStructure = {
      id: 1,
      name: 'Test pipeline',
      status: 'draft',
      schedule: '* * * * *',
      external: false,
      is_paused: false,
      link: '',
      sources: [],
      tags: [],
      relations: [
        {
          id: 1,
          parent: 71,
          child: 72,
          root: true,
        },
        {
          id: 2,
          parent: 71,
          child: 73,
          root: true,
        },
      ],
    };

    const result = convertPipelineStructureToDiagramData(input);

    expect(result.links).toHaveLength(input.relations.length);
    expect(result.links).toContainEqual({ id: expect.any(Number), source: 71, target: 72 });
    expect(result.links).toContainEqual({ id: expect.any(Number), source: 71, target: 73 });
  });

  it("converts relations to nodes' connections property", () => {
    expect.hasAssertions();
    const input: PipelineStructure = {
      id: 1,
      name: 'Test pipeline',
      status: 'draft',
      schedule: '* * * * *',
      external: false,
      is_paused: false,
      link: '',
      tags: [],
      sources: [
        {
          id: 59,
          name: 'version_plus_id',
          transform_type: 'variable',
          rows_count: 1,
          status: 'accepted',
          x: 0,
          y: 0,
        },
        {
          id: 71,
          name: 'required split',
          transform_type: 'split',
          rows_count: 1,
          status: 'accepted',
          x: 0,
          y: 0,
        },
        {
          id: 72,
          name: 'A',
          transform_type: 'branch',
          rows_count: 1,
          status: 'accepted',
          x: 0,
          y: 0,
        },
        {
          id: 73,
          name: 'B',
          transform_type: 'branch',
          rows_count: 0,
          status: 'accepted',
          x: 0,
          y: 0,
        },
      ],
      relations: [
        {
          id: 1,
          parent: 59,
          child: 71,
          root: true,
        },
        {
          id: 2,
          parent: 71,
          child: 72,
          root: true,
        },
        {
          id: 3,
          parent: 71,
          child: 73,
          root: true,
        },
      ],
    };

    const result = convertPipelineStructureToDiagramData(input);

    expect(result.nodes).toHaveLength(input.sources.length);
    expect(result.nodes).toEqual([
      expect.objectContaining({ id: 59, connections: { from: [], to: [71] } }),
      expect.objectContaining({ id: 71, connections: { from: [59], to: [72, 73] } }),
      expect.objectContaining({ id: 72, connections: { from: [71], to: [] } }),
      expect.objectContaining({ id: 73, connections: { from: [71], to: [] } }),
    ]);
  });

  it('the output is compatible with the diagram', () => {
    expect.hasAssertions();
    const input: PipelineStructure = {
      id: 1,
      name: 'Test pipeline',
      status: 'draft',
      schedule: '* * * * *',
      external: false,
      is_paused: false,
      link: '',
      tags: [],
      sources: [
        {
          id: 59,
          name: 'version_plus_id',
          transform_type: 'variable',
          rows_count: 1,
          status: 'accepted',
          x: 0,
          y: 0,
        },
        {
          id: 71,
          name: 'required split',
          transform_type: 'split',
          rows_count: 1,
          status: 'accepted',
          x: 0,
          y: 0,
        },
      ],
      relations: [
        {
          id: 1,
          parent: 59,
          child: 71,
          root: true,
        },
      ],
    };

    const result = convertPipelineStructureToDiagramData(input);

    expect(result.nodes).toHaveLength(input.sources.length);
    expect(result.nodes).toEqual(
      input.sources.map((source) =>
        expect.objectContaining({
          id: source.id,
          x: expect.any(Number),
          y: expect.any(Number),
          connections: { from: expect.any(Array), to: expect.any(Array) },
        }),
      ),
    );

    expect(result.links).toHaveLength(input.relations.length);
    expect(result.links).toEqual(
      input.relations.map((link) =>
        expect.objectContaining({
          id: expect.any(Number),
          source: link.parent,
          target: link.child,
        }),
      ),
    );
  });
});
