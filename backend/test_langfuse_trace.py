import os
os.environ['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY', '')

from langfuse.callback import CallbackHandler
from agents.graph import graph_app

# Create handler
handler = CallbackHandler(session_id='test_session', trace_name='Test Trace')
print('Before invoke - trace_id:', handler.get_trace_id())
print('Before invoke - trace:', handler.trace)
print()

# Create minimal state
initial_state = {
    'tool_id': 'test-001',
    'tool_name': 'Test Tool',
    'category': 'test.csv',
    'schema_fields': ['id', 'name'],
    'raw_search_context': 'test context',
    'source_urls': [],
    'extracted_data': {'name': 'TestTool', 'description': 'A test tool'},
    'original_data': {'id': 'test-001', 'name': 'Test Tool'},
    'diff_summary': '',
    'lifecycle_status': '',
    'validation_passed': True,
    'recall_count': 1,
    'final_status': ''
}

print('Invoking graph with handler...')
try:
    result = graph_app.invoke(initial_state, config={'callbacks': [handler]})
    print('Graph invoked successfully')
except Exception as e:
    print(f'Graph invocation error: {type(e).__name__}: {e}')
    import traceback
    traceback.print_exc()

print()
print('After invoke - trace_id:', handler.get_trace_id())
print('After invoke - trace:', handler.trace)
print()
print('Flushing...')
try:
    handler.flush()
    print('Flushed successfully')
except Exception as e:
    print(f'Flush error: {e}')

print('After flush - trace_id:', handler.get_trace_id())
